
# 🏈 \[WIP\] Football Charting

This is a work in progress, and is not yet fully functional.

## Description

This is a football charting application built with Next.js and TailwindCSS. It is designed to chart plays from a football game, and export the corresponding data to a CSV file. The application is [statically exported](https://nextjs.org/docs/app/building-your-application/deploying/static-exports), and is deployed on GitHub Pages.

The application is largely powered by our custom `useClickPosition` hook, which is used to track the position of the mouse click within an SVG image.
This hook allows us to track the position of the click and corresponding data in a structured manner, and export the data to a CSV file. This hook is located in `src/hooks/useClickPosition.tsx`.

## Inspiration

This application was heavily inspired and adapted from David Borland's [ClickMap](https://github.com/davidborland/ClickMap). We adapted the application to work via React/Next.js and added football-specific features.

## Installation

This is a [Next.js](https://nextjs.org) project

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view and interact with the application.
