import { PublishResult, TVisitor, ToMarkdown, ExtendsParam } from "@/types";
import { NotionPublisherPluginOption } from "@artipub/shared";
import { Heading } from "mdast";
import { createCommonJS } from "mlly";

const { require } = createCommonJS(import.meta.url);
const { Client } = require("@notionhq/client");
const { markdownToBlocks } = require("@tryfabric/martian");

export default function NotionPublisherPlugin(option: NotionPublisherPluginOption) {
  let extendsParam: ExtendsParam = {};
  return {
    name: "NotionPublisherPlugin",
    extendsParam(params: ExtendsParam) {
      extendsParam = params;
      return this;
    },
    async process(articleTitle: string, visit: TVisitor, toMarkdown: ToMarkdown): Promise<PublishResult> {
      visit("heading", (_node, _index, parent) => {
        const node = _node as Heading;
        if (parent && node.depth === 1) {
          parent.children.splice(0, (_index ?? 0) + 1);
          return true;
        }
      });

      const { content } = toMarkdown();
      const blocks = markdownToBlocks(content);
      const notion = new Client({ auth: option.api_key });

      async function postArticle() {
        const res = await notion.pages.create({
          parent: {
            type: "page_id",
            page_id: option.page_id,
          },
          properties: {
            title: [
              {
                text: {
                  content: articleTitle,
                },
              },
            ],
          },
          children: blocks,
        });

        return res;
      }

      function updateArticle() {
        //TODO: Implement update article
        throw new Error(`Failed to publish [${articleTitle}] to Notion, The Notion does not support updated articles at this time !`);
      }

      let article_id = option.update_page_id ?? extendsParam.pid;
      try {
        if (article_id) {
          await updateArticle();
        } else {
          const res = await postArticle();
          if (res.id) {
            article_id = res.id;
          } else {
            throw new Error(`Failed to publish [${articleTitle}] to Notion!`);
          }
        }
      } catch (error: any) {
        return {
          pid: article_id,
          success: false,
          info: error,
        };
      }

      const res: PublishResult = {
        pid: article_id,
        success: true,
        info: `Published [${articleTitle}] to Notion successfully!`,
      };
      return res;
    },
  };
}
