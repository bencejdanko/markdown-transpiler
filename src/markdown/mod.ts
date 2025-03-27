import { Transpiler } from "@transpiler/mod.ts";

import { Emphasis, Header1, Paragraph, Break, NewlineSpace, ThematicBreak } from "@markdown/plugins/mod.ts";

const inlineTranspiler = new Transpiler();
inlineTranspiler.addPlugin(Emphasis);
inlineTranspiler.addPlugin(Break);
inlineTranspiler.addPlugin(NewlineSpace);

export { inlineTranspiler }

const transpiler = new Transpiler();
transpiler.addPlugin(Header1);
transpiler.addPlugin(ThematicBreak);
transpiler.addPlugin(Paragraph);

export default transpiler;