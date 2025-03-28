import { Transpiler } from "@transpiler/mod.ts";

import {
  Anchor,
  Blockquote,
  Break,
  Emphasis,
  Escape,
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
inlineTranspiler.addPlugin(Math);
inlineTranspiler.addPlugin(NewlineSpace);

export { inlineTranspiler };

const transpiler = new Transpiler();
transpiler.addPlugin(Image);
transpiler.addPlugin(Anchor);
transpiler.addPlugin(Header1);
transpiler.addPlugin(ThematicBreak);
transpiler.addPlugin(Blockquote);
transpiler.addPlugin(Paragraph);

export default transpiler;
