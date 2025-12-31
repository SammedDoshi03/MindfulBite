# 🚀 Publishing MindfulBite to Google Play Store using EAS

This guide walks you through the process of building and submitting your app to the Google Play Store using Expo Application Services (EAS).

## Prerequisites

1.  **Google Play Developer Account**: You must have a paid developer account ($25 one-time fee).
2.  **Expo Account**: You need an account on [expo.dev](https://expo.dev).
3.  **EAS CLI**: Installed globally (`npm install -g eas-cli`).

## Step 1: Login to EAS

Open your terminal and login to your Expo account:

```bash
eas login
```

## Step 2: Configure the project

We have already created the `eas.json` file for you, which dictates how the app is built.

To link this local project to your Expo project on the cloud, run:

```bash
eas build:configure
```
*Select `Android` when prompted.*

## Step 3: Set up Google Play Credentials

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new Service Account.
3.  Grant it **Service Account User** role.
4.  Create a JSON Key for this service account and download it.
5.  Go to the [Google Play Console](https://play.google.com/console).
6.  Navigate to **Users and Permissions** -> **Invite New Users**.
7.  Add the email address of the service account you just created.
8.  Grant it **Admin** (or Release Manager) permissions.

Now, you can let EAS handle the credentials automatically for the build signing:

```bash
eas credentials
```

## Step 4: Build the App Bundle (AAB)

To generate the Android App Bundle (.aab) required for the Play Store, run:

```bash
eas build --platform android --profile production
```

*   This will upload your code to Expo's servers.
*   It will start a build queue.
*   Once finished, it will provide a link to download the `.aab` file.

*Note: For the FIRST submission, you must manually upload this .aab file to the Google Play Console to create the initial release.*

## Step 5: Automate Future Submissions (CD)

Once you have manually uploaded the first build and set up the store listing, you can automate future updates!

1.  Place your Google Service Account JSON key in the project root and name it `google-services-json-key.json`.
    *   **IMPORTANT**: Add this file to your `.gitignore` so you don't leak secrets!
    ```bash
    echo "google-services-json-key.json" >> .gitignore
    ```
2.  Run the submit command:

```bash
eas submit -p android --profile production
```

This will automatically upload your latest build to the "Internal Testing" track (as configured in `eas.json`).

## GitHub Actions for CI/CD

We have added a CI pipeline in `.github/workflows/ci.yml` that checks your code for errors on every push.

To fully automate the *deployment* via GitHub Actions (advanced), you would need to:
1.  Add `EXPO_TOKEN` to your GitHub Repository Secrets.
2.  Create a workflow that runs `eas build --auto-submit`.

For now, using the EAS CLI commands above is the most straightforward way to get your app live!
