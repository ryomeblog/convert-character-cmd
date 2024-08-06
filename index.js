#!/usr/bin/env node

const { exec } = require("child_process");
const { input, select } = require("@inquirer/prompts");
const fs = require("fs");
const path = require("path");
const aichat = require("./chat");

// jsonファイル
const configPath = path.join(__dirname, "json/config.json");
const charactersPath = path.join(__dirname, "json/characters.json");
// const artPath = path.join(__dirname, "asset/art.txt");

async function init() {
  const apiKey = await input({ message: "OpenAI APIキーを入力してください:" });
  const characters = JSON.parse(fs.readFileSync(charactersPath, "utf8"));
  const characterValue = await select({
    type: "list",
    name: "character",
    message: "エラーを読み上げるキャラを選択してください:",
    choices: characters,
  });
  const selectedCharacter = characters.find(
    (character) => character.value === characterValue
  );
  try {
    const err400Response = await aichat.fetchAiChatResponse(
      `ステータスコードが400のエラー（リクエストエラー: リクエストが不正です。）について${selectedCharacter.name}でコメントしてください。
      ${selectedCharacter.name}の定義は次のようになります。
      ${selectedCharacter.setting}`,
      apiKey
    );
    const err400text = err400Response.choices[0].message.content.trim();

    const err401Response = await aichat.fetchAiChatResponse(
      `ステータスコードが401のエラー（認証エラー: APIキーが無効です。）について${selectedCharacter.name}でコメントしてください。
      ${selectedCharacter.name}の定義は次のようになります。
      ${selectedCharacter.setting}`,
      apiKey
    );
    const err401text = err401Response.choices[0].message.content.trim();

    const err429Response = await aichat.fetchAiChatResponse(
      `ステータスコードが429のエラー（レート制限エラー: リクエストが多すぎます。しばらくしてから再試行してください。）について${selectedCharacter.name}でコメントしてください。
      ${selectedCharacter.name}の定義は次のようになります。
      ${selectedCharacter.setting}`,
      apiKey
    );
    const err429text = err429Response.choices[0].message.content.trim();

    const err500Response = await aichat.fetchAiChatResponse(
      `ステータスコードが500のエラー（サーバーエラー: サーバーで問題が発生しました。後でもう一度試してください。）について${selectedCharacter.name}でコメントしてください。
      ${selectedCharacter.name}の定義は次のようになります。
      ${selectedCharacter.setting}`,
      apiKey
    );
    const err500text = err500Response.choices[0].message.content.trim();

    const initSettingResponse = await aichat.fetchAiChatResponse(
      `「初期設定が完了しました」を${selectedCharacter.name}で表現してください。
        ${selectedCharacter.name}の定義は次のようになります。
        ${selectedCharacter.setting}`,
      apiKey
    );
    const initSettingtext =
      initSettingResponse.choices[0].message.content.trim();

    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          apiKey,
          selectedCharacter,
          err400text,
          err401text,
          err429text,
          err500text,
        },
        null,
        2
      )
    );
    console.log(initSettingtext);
  } catch (fetchError) {
    if (fetchError instanceof Error) {
      console.error("エラーが発生しました:", fetchError.message);
    } else {
      if (fetchError.status === 400) {
        console.error("リクエストエラー: リクエストが不正です。");
      } else if (fetchError.status === 401) {
        console.error("認証エラー: APIキーが無効です。");
      } else if (fetchError.status === 429) {
        console.error(
          "レート制限エラー: リクエストが多すぎます。しばらくしてから再試行してください。"
        );
      } else if (fetchError.status === 500) {
        console.error(
          "サーバーエラー: サーバーで問題が発生しました。後でもう一度試してください。"
        );
      } else {
        console.error(
          `不明なエラーが発生しました。ステータスコード: ${fetchError.status}`
        );
      }
    }
  }
}

async function run(command) {
  if (!fs.existsSync(configPath)) {
    console.error(
      'APIキーが設定されていません。まず "ce init" コマンドを実行してください。'
    );
    process.exit(1);
  }

  exec(command, async (error, stdout) => {
    if (error) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      try {
        const response = await aichat
          .fetchAiChatResponse(
            `次のエラーメッセージについてエラーに対しての原因と対処法を${config.selectedCharacter.name}で表現してください。
          コメントは日本語で出力してください。

          ${config.selectedCharacter.name}の定義は次のようになります。
          ${config.selectedCharacter.setting}
          
          エラーメッセージ：${error.message}`,
            config.apiKey
          );

        console.error(`エラーメッセージ：${error.message}`);
        // const artContent = fs.readFileSync(artPath, "utf8");
        // console.error(`${artContent}`);
        console.error(`${response.choices[0].message.content.trim()}`);
      } catch (fetchError) {
        let errMsg = `不明なエラーが発生しました。ステータスコード: ${fetchError.status}`;
        if (!fetchError.status) {
            errMsg = `エラーが発生しました:${fetchError.message}`;
        } else {
          switch (fetchError.status) {
            case 400:
              errMsg =
                config.err400text ?? "リクエストエラー: リクエストが不正です。";
              break;
            case 401:
              errMsg = config.err401text ?? "認証エラー: APIキーが無効です。";
              break;
            case 429:
              errMsg =
                config.err429text ??
                "レート制限エラー: リクエストが多すぎます。しばらくしてから再試行してください。";
              break;
            case 500:
              errMsg =
                config.err500text ??
                "サーバーエラー: サーバーで問題が発生しました。後でもう一度試してください。";
              break;
          }
        }
        console.error(errMsg);
      }
      return;
    }
    console.log(`出力: ${stdout}`);
  });
}

const args = process.argv.slice(2);
if (args[0] === "init") {
  init();
} else if (args[0] === "run") {
  run(args.slice(1).join(" "));
} else {
  console.error(
    "不明なコマンドです。使用方法: ce init または ce run <command>"
  );
}