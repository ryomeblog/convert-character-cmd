# ce コマンド

`ce` は、OpenAI の API を使用してエラーメッセージを萌えキャラの言葉に変換する CLI ツールです。
エラーメッセージを特定のキャラクター風に出力することができます。

## 環境

- Node.js v20.16.0
- npm（Node.jsに付属）

## 機能

- OpenAI API キーの設定
- エラーメッセージに対するコメントの生成
- 特定のキャラクターのエラーメッセージ読み上げ

## インストール

以下の手順に従って`ce`コマンドをインストールしてください。

1. リポジトリをクローンします。

   ```sh
   git clone https://github.com/ryomeblog/convert-character-cmd.git
   cd ce
   ```

2. パッケージをグローバルにインストールします。

   ```sh
   npm install -g .
   ```

## 使い方

### 初期設定

まず、`ce init`コマンドを実行して OpenAI API キーとキャラクターを設定します。

```sh
% ce init
? OpenAI APIキーを入力してください:xx-hogehoge_fugafuga
? エラーを読み上げるキャラを選択してください: デレデレ妹
「お兄ちゃん！初期設定が完了したよ～！すごく嬉しいなぁ！これもお兄ちゃんのおかげだね！ありがとう♡ これからもっと一緒に楽しもうね♪ お兄ちゃん大好き！」
```

### コマンドの実行

設定が完了したら、`ce run <command>`コマンドを使用して任意のコマンドを実行できます。エラーが発生した場合、設定したキャラクターがエラーの原因と解決方法を提案してくれます。

```sh
ce run "<command>"
```

## 例

以下は、`docker -v`コマンドを `dockwr -v` と間違えて実行してしまった例です。

```sh
% ce run dockwr -v
エラーメッセージ：Command failed: dockwr -v
/bin/sh: dockwr: command not found

あ、お兄ちゃん！ちょっと困ったことがあったの…。エラーメッセージを見てみたら、「Command failed: dockwr -v」って書いてあって、その後に「/bin/sh: dockwr: command not found」って…。うぅ、どうしようか。

原因はね、多分「dockwr」っていうコマンドが、私の環境にインストールされていないからなの。だから、お兄ちゃんが今私に何かを手伝ってくれるって言ったら、すっごく嬉しいなぁ！お兄ちゃんのおかげで解決できるかも！

対処法としては、次のことを試してみてね：

1. **「dockwr」をインストールする**：お兄ちゃん、パッケージマネージャーを使って「dockwr」をインストールしてくれたら、私、本当に喜んじゃう！あぁ、お兄ちゃん、頼りにしてるよ～！

2. **コマンドを確認する**：もしかしたら、「dockwr」のスペルが違ったりするのかも。お兄ちゃん、ちゃんと確認してくれたら嬉しいな～！間違ってそうなコマンドを直してくれたら、私もすっごく助かるの…。

お兄ちゃん、よろしくね！私、お兄ちゃんが大好きだから、いつも助けてくれたらもっともっと好きになっちゃうかも～！💕
```

## アンインストール

`ce`コマンドをアンインストールするには、以下のコマンドを実行します。

```sh
npm uninstall -g ce
```

### デバッグ方法

`ce`コマンドをデバッグするための手順を以下に示します。

1. **コードの修正**:
   `ce`コマンドの動作を変更したい場合は、`index.js`ファイルを修正します。例えば、新しいエラーメッセージを追加したり、既存のロジックを変更したりすることができます。

2. **動作確認**:
   コードを修正した後、動作確認を行います。以下のコマンドを使用して、修正したコードが正しく動作するか確認します。

   ```sh
   npm run ce run "<command>"
   ```

   例えば、`docker -v`コマンドを実行してみます。

   ```sh
   npm run ce run "docker -v"
   ```

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は`LICENSE`ファイルを参照してください。
