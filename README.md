This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


.
├── package.json
├── scripts/
│   ├── .env
│   └── generateTranslations.js
└── src/
    ├── components/
    │   ├── AlphabetButtons.tsx
    │   ├── BackgroundCascade.tsx
    │   └── Wordle.tsx
    ├── data/
    │   ├── combined_word_list.json
    │   └── translated_words.json
    └── app/
        ├── globals.css
        ├── layout.tsx
        └── page.tsx

package.json

プロジェクトの情報や、next build などの実行可能なスクリプト、依存パッケージを管理するファイルです。

scripts/

ビルドやデータ生成など、開発時に一度だけ実行するような補助的なスクリプトを格納するディレクトリです。

scripts/.env

GOOGLE_TRANSLATE_API_KEY などの、公開してはいけないAPIキーや環境変数を保存するファイルです。generateTranslations.jsから参照されます。

scripts/generateTranslations.js

このプロジェクトの核となるデータ生成スクリプトです。元の英単語リストを元に、GoogleのAPIを呼び出して日本語訳のリストを生成し、src/data/translated_words.json として出力します。

src/

アプリケーションの主要なソースコードが格納されるディレクトリです。

src/data/

生成されたデータや静的なリソースを格納するディレクトリです。アプリケーションのコンポーネントから直接インポートされます。

src/data/translated_words.json

scripts/generateTranslations.js によって、Google Translate API（Geminiの基盤技術の一つ） を利用して翻訳された日本語の単語リストが保存されます。

src/data/combined_word_list.json

translated_words.json と元の英単語リストを合成して作成された、最終的にアプリケーションで使用する単語リストです。

src/components/

Wordle.tsx や BackgroundCascade.tsx のような、再利用可能なReactコンポーネントを配置します。

src/app/

Next.jsのApp Routerに基づいた、各ページの本体となるファイル群です。page.tsxがトップページに対応します。