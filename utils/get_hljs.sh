#!/bin/sh

# SPDX-FileCopyrightText: 2022 Digital Dasein <https://digitaldasein.org/>
# SPDX-FileCopyrightText: 2022 Gerben Peeters <gerben@digitaldasein.org>
# SPDX-FileCopyrightText: 2022 Senne Van Baelen <senne@digitaldasein.org>
#
# SPDX-License-Identifier: MIT

VERSION=$HLJS_VERSION
VERSION_LN=$HLJS_LN_VERSION
DEFAULT_VERSION="11.6.0"
DEFAULT_VERSION_LN="2.8.0"

OUT_DIR="demo"
OUT_FILE_CSS="highlight.min.css"
OUT_FILE_JS="highlight.min.js"
OUT_FILE_JS_LN="highlight-ln.min.js"

HTML_FILE="demo/index.html"


if [ -z "$VERSION" ]; then
    VERSION="$DEFAULT_VERSION"
fi

if [ -z "$VERSION_LN" ]; then
    VERSION_LN="$DEFAULT_VERSION_LN"
fi

wget -O "${OUT_DIR}/${OUT_FILE_CSS}" cdnjs.cloudflare.com/ajax/libs/highlight.js/$VERSION/styles/default.min.css
wget -O "${OUT_DIR}/${OUT_FILE_JS}" cdnjs.cloudflare.com/ajax/libs/highlight.js/$VERSION/highlight.min.js
wget -O "${OUT_DIR}/${OUT_FILE_JS_LN}" cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/$VERSION_LN/highlightjs-line-numbers.min.js


HTML_HEADER_STRING="  <link rel=\"stylesheet\" href=\"${OUT_FILE_CSS}\">\n  <script src=\"${OUT_FILE_JS}\"><\/script>\n  <script src=\"${OUT_FILE_JS_LN}\"><\/script>\n  <script>hljs.highlightAll();hljs.initLineNumbersOnLoad();<\/script>"

if [ ! $(grep "highlight.min.js" demo/index.html) ];then
    # replace string (these substitutions are linux and osx compatible)
    sed -e  "s/<\/head>/${HTML_HEADER_STRING}\n<\/head>/g" "$HTML_FILE" \
        > "$HTML_FILE.new"
    mv -- "$HTML_FILE.new" "$HTML_FILE"
fi
