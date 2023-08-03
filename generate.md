# Generative NFT Guide

## 👩‍🎓 Who is this guide for

Generative NFTs represent a unique art form generated through computer algorithms. These NFTs are crafted by combining distinct attributes such as head, eyes, mouth, etc., in a randomized manner, resulting in one-of-a-kind creations.

This tutorial is for those who TODO хочет понять как из кусочков изображений автоматически сгенерировать коллекцию такую как криптопанки. 

This guide is perfect for beginners who don't have extensive programming knowledge. However, having some familiarity with using the terminal will be useful.

By the completion of this tutorial, you will have a clear understanding of how to use scripts to generate images and NFT metadata and mint vast collections, illustrated through the example of the Sqrt Heads collection.

<image src="./docs/generate-intro.png"></iamge>


## ⚙️ Setup environment

To get started, we'll need node.js, git, and Visual Studio Code installed on your computer. If you haven't worked with git, node, and npm before, we recommend reading our [brief guide](./setup.md) to properly configure your environment.

### Download the project

You may do it in two ways.

1. Using terminal. Open your terminal, `cd` to desired directory, and execute the following command:
```sh
git clone git@github.com:UniqueNetwork/mass-nfts-doc.git
```

2. Manually. Go to the [Github repository](https://github.com/UniqueNetwork/mass-nfts-doc) and download the project by clicking `Code - Download ZIP`. Unzip it after downloading.

<image src="./docs/download.png"></image>

After downloading the project, open it in Visual Studio Code. Click on `"File"` and select `"Open Folder"`. Then, choose the folder where the project was downloaded.

### Install dependencies

In Visual Studio Code, access the built-in terminal by clicking on `"Terminal"` and then selecting `"New Terminal"`. Execute the following command:

```
npm install
```

<image src="./docs/terminal.png"></image>

Lastly, create a file named `config.js` in the root directory of your project and copy the contents from the `config.example.js` file into it. 

Congratulations! You're all set now. After following the previous steps, your project should resemble the screenshot below.

<image src="./docs/setup-finish.png" width=400></image>

## 🖼 Design image parts

<image src="./docs/combine.png" width=400></image>

The image parts should generally include some combinable parts with transparent background. Store them in `generate` folder. Для этого примера мы уже положили некоторое количество изображений, feel free to use them, or замените их на свои.

If you want to set a cover for a collection, then save the cover file in images folder. Store the cover file name in the coverFileName property in the `config.js` file. If you do not need to create a cover, then assign an empty string to coverFileName.

Additionally, place an image named `cover.png` in the `generate` folder, which will serve as the cover image for the collection.

> 💡 Убедитесь что ваши изображения соответствуют следующему:
>
> 1. Все изображния имеют одинаковую длинну и ширину
> 2. Изобржаения имеют прозрачный фон (png)
> 3. Изображения спозиционированы так, что при наложении они образуют цельное изображение
> 4. Названия изображений должны быть вида {attribute-name}{index}.png, например eye1.png, eye2.png


## Describe NFT attributes

Generally, combinable parts produce NFT traits. For example, if the `eye2.png` image is used to generate the NFT image, it will have `joy` trait. 

Также важно продумать рарити для свойств. Например, мы можем хотеть чтобы `head2.png` встречалась в среднем у 10% токенов. А трейт jewelry вообще был только у 20% процентов нфт, при этом `jewelry1.png` в 5%, а в оставшихся 15% `jewelry2.png`.

We будем исопльзовать гугл таблицы для заполнения свойств. Here is how to code this:

https://docs.google.com/spreadsheets/d/1BkBtTPcy_lvP1X23qdBQ13qQMVwirS4ZjBApp3sLbVU/edit#gid=0

<image src="./docs/describe-attributes.png"></image>

В колонке `name` перечислите все возможные атрибуты закодированные в изображении.

Важно:

1. Название аттрибутов должно совпадать с названием изображений.
2. Порядок аттрибутов важен. Например, если `head` это базовое изображение на которое будут накладываться все остальные, оно должно стоять первым в списке

В колонке `attribute exist` укажите процентную вероятность, с которой данное свойство будет присутствовать. Например, `head`, `eye` и `mouth` обязательные свойства, вероятность их наличия установлена в 100. `hair` будет встречаться только у 70% токенов, а `jewelry` только у 20%.

В последующих колонках перечислите названия свойств и вероятность их появления среди токенов.

Важно:

1. Порядок перечисления свойств важен и должен соответствовать порядковому номеру соответствующего изображения. Например `jewelry1.png` соответствует аттрибуты `gold`, а `jewelry2.png` – `silver`, поэтому порядок в таблице должерн быть именно таким – gold, silver.
2. Укажите вероятность выпадение свойства для каждого отдельного НФТ. Например, для `gold` установлена вероятность выпадения `5%`, а для silver `15%`. Итоговые значения будут выглядеть так: `gold%5`, `silver%15`. Суммарная вероятность установленная для `values` не должна привышать значение установленной в `attribute exist` колонке.

Export table to csv format by clicking on `File - Download - Comma Separated Values (.csv)`

<image src="./docs/export-csv.png"></image>

> ✏️ Rename the exported file to `attributes.csv` and save it in the `generate` folder near the images parts.

### Set the collection metadata

> ✏️ In the `config.js` file, fill in the fields `collectionName` (max 64 symbols), `collectionDescription` (max 256 symbols), and `tokenPrefix` (max 4 symbold).
>
> If you want to make nesting available for your collection, also set the `nesting` property. [Read more about nesting](https://docs.unique.network/networks/nesting.html).

## ⛓ Prepare Substrate Address with Seed

To create the collection and tokens, you will need an address with balance. If you don't have account yet you may create it with [Polkadot{.js} extension for Chrome](https://polkadot.js.org/extension/).

- Open the Polkadot{.js} extension in your browser.
- Look for the "+" icon and click on it.
- A menu will appear. From the options presented, select "Create new account".
- A 12-words mnemonic phrase will be generated. Make sure to save it securely.

<image src="./docs/extension.png"></image>

> ✏️ In the `config.js` file, fill in the `ownerSeed` field.
> 
> ❗️ Do not commit your secrets, such as `ownerSeed`, to version control! We have added `config.js` to the `.gitignore` file for this purpose.

### Get some tokens

For this guide, we are using Opal network, and you can obtain OPL tokens for free by using [Telegram faucet bot](https://t.me/unique2faucet_opal_bot). You will have to provide your address (not a mnemonic phrase!). Click on the circle icon next to your account in the Polkadot extension to copy it.


> 💡 If you are ready to mint tokens on the mainnet (Quartz or Unique), make sure to change the endpoint variable in the config.js file. Set it to `https://rest.unique.network/quartz/v1` for Quartz or `https://rest.unique.network/unique/v1` for Unique.
>
> - Quartz Network tokens (QTZ) are available on [MEXC](https://www.mexc.com/ru-RU/exchange/QTZ_USDT?_from=search)
> 
> - For Unique Network tokens (UNQ) you can visit [Huobi](https://www.huobi.com/en-us/trade/unq_usdt?type=spot)


Теперь все готово для создания коллекции и токенов

## 💎 Create Collection and NFTs

### Step 1: Generate images and metadata

```sh
node 0-generate-nfts.js
```

### Step 2: Upload images to IPFS

In simple terms, the Inter-Planetary File System (IPFS) is a distributed file storage protocol that enables a network of computers to store any kind of data in a reliable and unchangeable manner.

Open the VS Code terminal and execute the following command:

```sh
node 1-upload-images.js
```

After a short period of time, you will see the result of executing the command:

<image src="./docs/upload.png"></image>

This script will pack all the images into a zip archive and save it as data/archive.zip. Then it will upload it to IPFS. Make sure that all your files are successfully uploaded by visiting the link provided in the console output.

> ✏️ In the `config.js` file, fill in the `fileUrl` set provided link. 

### Step 3: Create a collection

We have set the collection metadata in the previous steps. Double-check that the name, description, tokenPrefix, and attributes fields are filled in `config.js`. Afterward, execute the script.

```sh
node 2-create-collection.js
```

After a short period of time, you will see the result of executing the command:

```
🚀 Creating collection... done!
❗️❗️❗️ add to "config.js" collectionId: 1877
```

> ✏️ In the `config.js` file, fill in the `collectionId` set provided value.

Your collection has been created, and you can check it on your [wallet](https://wallet.unique.network/) or on [uniquescan.io](https://uniquescan.io/). Now your collection doesn't have any NFTs yet, so let's create some.


### Step 4: Create NFTs

We have set the token metadata in the previous steps in the nfts.csv file, check again if it exists. After that, execute the following script.

```sh
node 3-create-nfts.js
```

After a short period of time, you will see the result of executing the command:

```
🚚 successfully created 1 part of NFT's
🚀 Creating NFTs... done!
Token Ids: 1, 2, 3, 4, 5

🔗 You can find your collection and tokens here: https://uniquescan.io/opal/collections/1877
```

Your collection and tokens have been successfully created! You can find it in your [wallet](https://wallet.unique.network/). Or you can connect to [Unique Market](https://unqnft.io/) and list your NFTs for sale.
