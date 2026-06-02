export const fallbackUsers = [
  {
    id: 1,
    username: "ALEX_CHEN",
    displayName: "Alex Chen",
    role: "DIGITAL_ARCHIVIST",
    bio: "Documenting the collision of physical space and digital entropy.",
    location: "TOKYO // NEO-SF",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCp0RXWV3pkK_1xGcuViBRwIPeH9cBbPgs07B3p24jUrqe15_GIkOHMMV5_4-hilWFvAzfgubzyBS_fWgvycsIgMLjlpQTkfZzIbITkjNLkuLFtRY-qknmLcHUU2wUSjAPu22noR_ZZZNIwc3tGKSulQCbKMkIQ645OmRmNH6M6YGTJTvyN9epnNGhWMi9BMUYNWU4UQUQlcHSwvSXx-MHaTqpg4CsOou5F5Kv5X0pXTxIvj81bFFNxF30oofxfLEM8TmHGOl2dYNE",
    followerCount: 84200
  },
  {
    id: 2,
    username: "CYBER_JUNKIE",
    displayName: "Cyber Junkie",
    role: "DATA_RUNNER",
    bio: "Compiling corrupted renders from dead networks.",
    location: "SECTOR 7G",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKZkbc9aD2P9sctmxrCZOYHAFHNdS6wOaYn8k6VlTVTuO7_wGpb8r5tYXsmlMe_xrOkujbROtRALnBMOtwBHIwMpblEvAujXON24aktCkV5KEeaVpnoJsCj9qGIPUUtPKO4fxHWUg734HZqHX1LAtRnKYwMOwSftTdFpknCbXNtfQUSAnrHMtAmSsgIxa_zqwarsO7UFekhLLN0TtuvIlBP6mpe93A-ivG4-BWpgcNjEKScyfmqNfwJ8pXPwjUP18VAXGSH4R3070",
    followerCount: 1290
  }
];

export const fallbackPosts = [
  {
    id: 1,
    userId: 2,
    title: "STRUCTURAL_DECAY.RAW",
    body: "INITIALIZING SEQUENCE. Rendering test environment alpha_0.9. Integrity checks complete.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgO4nfbUGPHUlurGasaMjG5EVYBSjkl1iSc38otSi9DFZdDq8ER50F0L0bxDXCqowAKSuoFA6afXbqWpLrFwDgfA4tPKXY1LMkXERxG6WsYdfXspYnfqSWK_7MRQT3QdtkSUyEvUN4zwlEsat70mkoUhr8oK--YXxG62D69L0CvFwpB3Ed_-yWyDnW3MWhGd2kWQwrX1N1OJY_-OEwfaXh7XQEed_uHLWE5OkBngnL8nqrGlIPXiWA75Q2bPcTLTR_sLz8HFxtNMY",
    timestampLabel: "12:04:01",
    likeCount: 404,
    user: fallbackUsers[1]
  },
  {
    id: 2,
    userId: 1,
    title: "SYSTEM_BROADCAST",
    body: "NETWORK STABILITY COMPROMISED. RE-ROUTING TO SECONDARY NODES. EXPECT LATENCY FLUCTUATIONS.",
    imageUrl: "",
    timestampLabel: "09:12:44",
    likeCount: 128,
    kind: "broadcast",
    user: fallbackUsers[0]
  }
];
