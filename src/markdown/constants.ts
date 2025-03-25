const enum Block {
    HEADER1="\n# ",
    HEADER2="\n## ",
    HEADER3="\n### ",
    HEADER4="\n#### ",
    HEADER5="\n##### ",
    HEADER6="\n###### ",

    BLOCKQUOTE="\n> ",
    
    LIST="\n- ",

}

const enum Inline {
    IMAGE="![",
    IMAGE_CLOSE="]",
    IMAGE_SRC="(",
    IMAGE_CLOSE_SRC=")",
}

export { Block, Inline }