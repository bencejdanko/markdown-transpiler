import { Transpiler } from "@transpiler/mod.ts";

import {
  Anchor,
  Blockquote,
  Break,
  Code,
  EmDash,
  Emphasis,
  Escape,
  FrontMatter,
  Header1,
  Image,
  Math,
  NewlineSpace,
  Paragraph,
  ThematicBreak,
} from "@markdown/plugins/mod.ts";

const inlineTranspiler = new Transpiler();
inlineTranspiler.addPlugin(Image);
inlineTranspiler.addPlugin(Emphasis);
inlineTranspiler.addPlugin(Anchor);
inlineTranspiler.addPlugin(Break);
inlineTranspiler.addPlugin(Escape);
inlineTranspiler.addPlugin(Code);
inlineTranspiler.addPlugin(Math);
inlineTranspiler.addPlugin(EmDash);
inlineTranspiler.addPlugin(NewlineSpace);

export { inlineTranspiler };

const transpiler = new Transpiler();
transpiler.addPlugin(FrontMatter);
transpiler.addPlugin(Image);
transpiler.addPlugin(Anchor);
transpiler.addPlugin(Header1);
transpiler.addPlugin(ThematicBreak);
transpiler.addPlugin(Blockquote);
transpiler.addPlugin(Paragraph);

export default transpiler;

export interface Metadata {
  title: string;
  description: string;
}
