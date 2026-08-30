/**
 * GitHub API Service with automatic fallback for static hosts like Vercel/Netlify.
 * If backend endpoints (/api/github/*) return non-JSON (e.g. 404 HTML),
 * this service automatically falls back to direct GitHub REST API calls from the browser.
 */

export interface RepoStatsResult {
  success: boolean;
  repo?: string;
  branch?: string;
  folders?: string[];
  stats?: {
    papersCount: number;
    syllabusCount: number;
    notesCount: number;
    otherJsonCount: number;
    totalFilesCount: number;
  };
  files?: {
    papers: string[];
    syllabus: string[];
    notes: string[];
    otherJson: string[];
  };
  error?: string;
}

export interface ConnectionTestResult {
  success: boolean;
  message?: string;
  user?: {
    login: string;
    avatar_url: string;
    name: string;
  };
  repoStatus?: {
    exists: boolean;
    isPrivate?: boolean;
    defaultBranch?: string;
    repoName?: string;
  };
  error?: string;
}

// Helper to safely parse JSON response
async function safeParseJson(res: Response): Promise<{ isJson: boolean; data: any }> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return { isJson: false, data: null };
  }
  try {
    const data = await res.json();
    return { isJson: true, data };
  } catch {
    return { isJson: false, data: null };
  }
}

/**
 * Fetch GitHub repository tree and calculate stats
 */
export async function fetchRepoStats(
  token?: string,
  owner?: string,
  repo?: string,
  branch?: string
): Promise<RepoStatsResult> {
  const effectiveOwner = (owner || localStorage.getItem('abhyaas_gh_owner') || 'abhyaas-app').trim();
  const effectiveRepo = (repo || localStorage.getItem('abhyaas_gh_repo') || 'AbhyaasData').trim();
  const effectiveToken = (token || localStorage.getItem('abhyaas_gh_token') || '').trim();

  if (!effectiveOwner || !effectiveRepo) {
    return { success: false, error: 'Repository owner and name are required.' };
  }

  // 1. Try backend API endpoint first
  try {
    const res = await fetch('/api/github/fetch-repo-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: effectiveToken, owner: effectiveOwner, repo: effectiveRepo, branch }),
    });

    const { isJson, data } = await safeParseJson(res);
    if (isJson && data) {
      return data;
    }
  } catch (e) {
    console.warn('Backend /api/github/fetch-repo-stats unavailable, falling back to direct GitHub API:', e);
  }

  // 2. Direct GitHub REST API fallback (for static Vercel/Netlify hosting)
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (effectiveToken) {
      headers.Authorization = `Bearer ${effectiveToken}`;
    }

    let targetBranch = branch || 'main';
    let treeUrl = `https://api.github.com/repos/${effectiveOwner}/${effectiveRepo}/git/trees/${targetBranch}?recursive=1`;
    let treeRes = await fetch(treeUrl, { headers });

    if (!treeRes.ok && targetBranch === 'main') {
      targetBranch = 'master';
      treeRes = await fetch(`https://api.github.com/repos/${effectiveOwner}/${effectiveRepo}/git/trees/master?recursive=1`, { headers });
    }

    if (!treeRes.ok) {
      let errMsg = `Could not fetch repository (${treeRes.status} ${treeRes.statusText})`;
      if (treeRes.status === 404) {
        errMsg = `Repository "${effectiveOwner}/${effectiveRepo}" not found or private. Please check token permissions.`;
      } else if (treeRes.status === 401) {
        errMsg = `Invalid or expired GitHub Personal Access Token. Please set a valid token.`;
      }
      return { success: false, error: errMsg };
    }

    const treeData = await treeRes.json();
    const tree: Array<{ path: string; type: string }> = treeData.tree || [];

    const papersFiles: string[] = [];
    const syllabusFiles: string[] = [];
    const notesFiles: string[] = [];
    const otherJsonFiles: string[] = [];
    const foldersSet = new Set<string>();

    tree.forEach((item) => {
      if (item.type === 'tree') {
        foldersSet.add(item.path);
      } else if (item.type === 'blob') {
        const lastSlash = item.path.lastIndexOf('/');
        if (lastSlash > 0) {
          foldersSet.add(item.path.substring(0, lastSlash));
        }

        const lowerPath = item.path.toLowerCase();
        if (lowerPath.endsWith('.json') || lowerPath.endsWith('.md')) {
          if (lowerPath.includes('paper') || lowerPath.includes('qbank') || lowerPath.includes('question')) {
            papersFiles.push(item.path);
          } else if (lowerPath.includes('syllabus') || lowerPath.includes('curriculum')) {
            syllabusFiles.push(item.path);
          } else if (lowerPath.includes('note') || lowerPath.includes('revision')) {
            notesFiles.push(item.path);
          } else if (lowerPath.endsWith('.json')) {
            otherJsonFiles.push(item.path);
          }
        }
      }
    });

    return {
      success: true,
      repo: `${effectiveOwner}/${effectiveRepo}`,
      branch: targetBranch,
      folders: Array.from(foldersSet).sort(),
      stats: {
        papersCount: papersFiles.length,
        syllabusCount: syllabusFiles.length,
        notesCount: notesFiles.length,
        otherJsonCount: otherJsonFiles.length,
        totalFilesCount: papersFiles.length + syllabusFiles.length + notesFiles.length + otherJsonFiles.length,
      },
      files: {
        papers: papersFiles,
        syllabus: syllabusFiles,
        notes: notesFiles,
        otherJson: otherJsonFiles,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to communicate with GitHub API.',
    };
  }
}

/**
 * Test Connection to GitHub and check Repo existence
 */
export async function testConnection(
  token?: string,
  owner?: string,
  repo?: string
): Promise<ConnectionTestResult> {
  const effectiveOwner = (owner || localStorage.getItem('abhyaas_gh_owner') || 'abhyaas-app').trim();
  const effectiveRepo = (repo || localStorage.getItem('abhyaas_gh_repo') || 'AbhyaasData').trim();
  const effectiveToken = (token || localStorage.getItem('abhyaas_gh_token') || '').trim();

  // 1. Try Backend First
  try {
    const res = await fetch('/api/github/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: effectiveToken, owner: effectiveOwner, repo: effectiveRepo }),
    });

    const { isJson, data } = await safeParseJson(res);
    if (isJson && data) {
      return data;
    }
  } catch (e) {
    console.warn('Backend /api/github/test-connection unavailable, falling back to direct GitHub API:', e);
  }

  // 2. Direct GitHub REST API Fallback
  if (!effectiveToken) {
    return {
      success: false,
      error: 'GitHub Personal Access Token is required. Please set token in settings.',
    };
  }

  try {
    const headers = {
      Authorization: `Bearer ${effectiveToken}`,
      Accept: 'application/vnd.github.v3+json',
    };

    const userRes = await fetch('https://api.github.com/user', { headers });
    if (!userRes.ok) {
      return { success: false, error: 'Invalid or expired GitHub Token.' };
    }
    const userData = await userRes.json();

    let repoStatus = { exists: false, isPrivate: false, defaultBranch: 'main', repoName: effectiveRepo };
    if (effectiveOwner && effectiveRepo) {
      const repoRes = await fetch(`https://api.github.com/repos/${effectiveOwner}/${effectiveRepo}`, { headers });
      if (repoRes.ok) {
        const repoData = await repoRes.json();
        repoStatus = {
          exists: true,
          isPrivate: repoData.private,
          defaultBranch: repoData.default_branch || 'main',
          repoName: repoData.name,
        };
      }
    }

    return {
      success: true,
      message: `Authenticated as @${userData.login}. ${repoStatus.exists ? `Repository ${effectiveOwner}/${effectiveRepo} is ready.` : `Repo ${effectiveOwner}/${effectiveRepo} not found.`}`,
      user: {
        login: userData.login,
        avatar_url: userData.avatar_url,
        name: userData.name || userData.login,
      },
      repoStatus,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Connection test failed.' };
  }
}

/**
 * Direct file push to GitHub via Content API (works client-side)
 */
export async function pushFileToGitHub(params: {
  token?: string;
  owner?: string;
  repo?: string;
  path: string;
  content: string;
  commitMessage: string;
  branch?: string;
}): Promise<{ success: boolean; commitSha?: string; fileUrl?: string; error?: string }> {
  const effectiveOwner = (params.owner || localStorage.getItem('abhyaas_gh_owner') || 'abhyaas-app').trim();
  const effectiveRepo = (params.repo || localStorage.getItem('abhyaas_gh_repo') || 'AbhyaasData').trim();
  const effectiveToken = (params.token || localStorage.getItem('abhyaas_gh_token') || '').trim();
  const branch = params.branch || 'main';

  // 1. Try Backend First
  try {
    const res = await fetch('/api/publish/github-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: effectiveToken,
        owner: effectiveOwner,
        repo: effectiveRepo,
        filename: params.path,
        content: JSON.parse(params.content),
        commitMessage: params.commitMessage,
        branch,
      }),
    });

    const { isJson, data } = await safeParseJson(res);
    if (isJson && data) {
      return data;
    }
  } catch (e) {
    console.warn('Backend publish route unavailable, attempting direct GitHub upload:', e);
  }

  // 2. Direct GitHub REST API Fallback
  if (!effectiveToken) {
    return { success: false, error: 'GitHub Token required for pushing files.' };
  }

  try {
    const headers = {
      Authorization: `Bearer ${effectiveToken}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    // Check if file already exists to get its SHA
    const fileUrl = `https://api.github.com/repos/${effectiveOwner}/${effectiveRepo}/contents/${params.path}?ref=${branch}`;
    const existingFileRes = await fetch(fileUrl, { headers });
    let existingSha: string | undefined;

    if (existingFileRes.ok) {
      const existingData = await existingFileRes.json();
      existingSha = existingData.sha;
    }

    // UTF-8 to Base64 encoder
    const utf8Bytes = new TextEncoder().encode(params.content);
    let binary = '';
    utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const base64Content = btoa(binary);

    const putRes = await fetch(`https://api.github.com/repos/${effectiveOwner}/${effectiveRepo}/contents/${params.path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: params.commitMessage || `Update ${params.path}`,
        content: base64Content,
        sha: existingSha,
        branch,
      }),
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      return {
        success: false,
        error: `GitHub Commit Error (${putRes.status}): ${errData.message || putRes.statusText}`,
      };
    }

    const result = await putRes.json();
    return {
      success: true,
      commitSha: result.commit?.sha || 'pushed',
      fileUrl: result.content?.html_url || `https://github.com/${effectiveOwner}/${effectiveRepo}/blob/${branch}/${params.path}`,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Direct GitHub push failed.' };
  }
}
