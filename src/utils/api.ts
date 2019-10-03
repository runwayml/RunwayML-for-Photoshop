

export const DAEMON_URL = "http://localhost:5142";

// API REQUESTS 

export const getAllModels = async () => {
  const response = await fetch(`${DAEMON_URL}/v1/models`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) return false;
  return response.json();
};

export const getModelSessions = async () => {
  const response = await fetch(`${DAEMON_URL}/v1/model_sessions?show=active`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) return false;
  return response.json();
};

export const startModelSession = async (
  modelVersionId,
  modelOptions,
  providerOptions
) => {
  const response = await fetch(`${DAEMON_URL}/v1/model_sessions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      modelVersionId,
      modelOptions,
      providerOptions,
      application: "Photoshop"
    })
  });
  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
  const { id } = await response.json();
  return id;
};

export const stopModelSession = async sessionId =>
  fetch(`${DAEMON_URL}/v1/model_sessions/${sessionId}`, { method: "delete" });

export const stopAllModelSessions = async () => {
  const response = await fetch(`${DAEMON_URL}/v1/model_sessions/stop_all`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      application: "Photoshop"
    })
  });
  return response.json();
};

export const healthcheck = async () => {
  try {
    const response = await fetch(`${DAEMON_URL}/v1/healthcheck`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      const { success } = await response.json();
      return success;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

export const runModel = async (url, body) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'cache-control': 'no-cache',
    },
    method: 'POST',
    body: JSON.stringify(body)
  });
  if (!response.ok) return false;
  return response.json();
}