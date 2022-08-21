# Blog

This blog is meant to be a place for me to talk about my projects,
and occasionally share some useful information. Enjoy!

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

# Infrastructure Setup

```bash
# from host
sudo apt-get update
sudo apt-get install nginx

# from remote
scp nginx.conf /etc/nginx/nginx.conf

# from host
sudo systemctl start nginx.service
sudo systemctl enable nginx.service
```

# Resizing Images

Images in posts should be a maximum of 1000px wide, and JPG format. To convert the images automatically, copy the full-sized images to `images/`, then run:

You need imagemagick to run these commands.

```bash
# assuming you have a directory under public with the original images, set IMGDIR to it
export IMGDIR="dashcam-to-speed-limits"

cp -r public/$IMGDIR images

# convert the jpgs and pngs to jpg, and downscale them if they're wider than 1000px
convert 'images/'$IMGDIR'/*.jpg[1000x>]' -set filename:base "%[basename]" "public/$IMGDIR/%[filename:base].jpg"
convert 'images/'$IMGDIR'/*.png[1000x>]' -set filename:base "%[basename]" "public/$IMGDIR/%[filename:base].jpg"

# downscape a thumbnail
convert 'image.jpg[200x>]' -set filename:base "%[basename]" "./%[filename:base].jpg"
```
