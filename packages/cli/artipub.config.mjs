import { defineConfig } from "@artipub/cli";
export default defineConfig({
  githubOption: {
    owner: "yxw007",
    repo: "repo1",
    dir: "dir",
    branch: "master",
    token: "token",
    cdn_prefix: "cdn_prefix",
    commit_author: "potter",
    commit_email: "aa4790139",
  },
  platforms: {
    notion: {
      token: "notion_token",
      pageId: "pageId",
    },
    devTo: {
      api_key: " api_key",
      published: " published",
      series: " series",
      main_image: " main_image",
      description: " description",
      organization_id: " 123",
    },
    nativeBlog: {
      dir_path: "dir_path",
    },
  },
});
