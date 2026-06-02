const request = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};

export const api = {
  posts: () => request("/posts"),
  users: () => request("/users"),
  comments: (postId) => request(`/posts/${postId}/comments`),
  createComment: (postId, payload) =>
    request(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  follow: (followerId, followingId) =>
    request("/followers", {
      method: "POST",
      body: JSON.stringify({ followerId, followingId })
    })
};
