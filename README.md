# Pinterest Managed Component

Find out more about Managed Components [here](https://blog.cloudflare.com/zaraz-open-source-managed-components-and-webcm/) for inspiration and motivation details.

[![Released under the Apache license.](https://img.shields.io/badge/license-apache-blue.svg)](./LICENSE)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/github/all-contributors/managed-components/snapchat?color=ee8449&style=flat-square)](#contributors)

## 🚀 Quickstart local dev environment

1. Make sure you're running node version >=17.
2. Install dependencies with `npm i`
3. Run unit test watcher with `npm run test:dev`

## ⚙️ Tool Settings

> Settings are used to configure the tool in a Component Manager config file

### TID `string` _required_

`tid` Pixel Tag ID - The Pinterest Tag ID is the unique identifier of your Pinterest tag. [Learn more](https://help.pinterest.com/en/business/article/track-conversions-with-pinterest-tag).

---

## Fields Description

Fields are properties that can/must be sent with certain events.

### Required Fields

#### Event Name `string` _required_

`event` - The name of the tracking event to be sent to Pinterest.

### Optional Fields

#### User Defined Event `string` _optional_

`ude` - Specify a custom event name for audience targeting purposes. Spaces in the event name will be removed. [Learn more](https://help.pinterest.com/en/business/article/add-event-codes).

#### Partner Data Email `string` _optional_

`pdem` - Specifies the email address associated with the partner data, if applicable.

#### Tag Manager `string` _optional_

`tm` - Indicates the Tag Manager used, defaults to 'pinterest-mc' if not specified.

#### Lead Type `string` _optional_

`lead_type` - Describes the type of lead being tracked, such as 'Newsletter', 'Signup', etc.

#### Video Title `string` _optional_

`video_title` - The title of the video for tracking specific video events.

#### E-commerce Tracking `boolean` _optional_

`ecommerce` - Enables or disables the forwarding of Zaraz E-commerce API events to Pinterest. This includes events like Search, AddToCart, and Checkout. [Learn more](https://help.pinterest.com/en-gb/business/article/add-event-codes).

---

## 📝 License

Licensed under the [Apache License](./LICENSE).

## 💜 Thanks

Thanks to everyone contributing in any manner for this repo and to everyone working on Open Source in general.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!