import { Transpiler } from "@transpiler/mod.ts";

import { Emphasis, Header1, Paragraph } from "@markdown/plugins/mod.ts";

const inlineTranspiler = new Transpiler();
inlineTranspiler.addPlugin(Emphasis);

export { inlineTranspiler }

const transpiler = new Transpiler();
transpiler.addPlugin(Header1);
transpiler.addPlugin(Paragraph);

export default transpiler;