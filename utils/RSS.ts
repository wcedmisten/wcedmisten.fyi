import { writeFileSync } from "fs";
import RSS from "rss";
export default async function generateRSS(posts: any[]) {
    const siteURL = "https://wcedmisten.fyi";

    const feed = new RSS({
        title: "William Edmisten",
        description: "A blog detailing my personal projects and other activities.",
        site_url: siteURL,
        feed_url: `${siteURL}/feed.xml`,
        image_url: `${siteURL}/favicon.ico`,
        language: "en",
        categories: ["openstreetmap", "ocr", "python", "postgis"],
        pubDate: new Date(),
        copyright: "Creative Commons Attribution 4.0 International",
    });

    posts.map((post) => {
        feed.item({
            title: post.meta.title,
            url: `${siteURL}/post/${post.filename}`,
            author: "William Edmisten <wcedmisten@gmail.com>",
            categories: post.meta.tags,
            date: post.meta.date + "T12:00:00.000",
            description: post.meta.description,
        });
    });

    // kind of a hack. can this be written directly to the build output?
    writeFileSync("./public/feed.xml", feed.xml());
}