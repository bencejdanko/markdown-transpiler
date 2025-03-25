const enum Block {
    HEADER1="# ",
    HEADER2="## ",
    HEADER3="### ",
    HEADER4="#### ",
    HEADER5="##### ",
    HEADER6="###### ",

    BLOCKQUOTE="> ",
    
    LIST="* ",
    LIST_DASH="- ",

}

const enum Inline {
    IMAGE="![",
    IMAGE_CLOSE="]",
    IMAGE_SRC="(",
    IMAGE_SRC_CLOSE=")",

    ITALIC="*",
    ITALIC_CLOSE="*",
}

export { Block, Inline }