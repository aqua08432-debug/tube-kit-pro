export interface NavItem {
    label: string;
    href: string;
    icon: string;
    featured?: boolean;
    badge?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export const navGroups: NavGroup[] = [
    {
        title: "YouTube Tools",
        items: [
            { label: "Video Downloader", href: "/youtube-downloader", icon: "Download", featured: true, badge: "HOT" },
            { label: "YouTube to MP3", href: "/youtube-to-mp3", icon: "Music", badge: "PRO" },
            { label: "Audio Downloader", href: "/youtube-audio-downloader", icon: "Headphones" },
            { label: "YouTube to MP4", href: "/youtube-to-mp4", icon: "Video" },
            { label: "Thumbnail Downloader", href: "/youtube-thumbnail-downloader", icon: "ImageIcon" },
            { label: "Transcript Extract", href: "/youtube-transcript", icon: "FileText" },
            { label: "AI Summarizer", href: "/youtube-summarizer", icon: "Sparkles", badge: "AI" },
            { label: "YouTube to Notes", href: "/youtube-to-notes", icon: "NotebookPen" },
            { label: "Video Subtitles", href: "/youtube-subtitle", icon: "Captions" },
        ],
    },
    {
        title: "PDF & Document Suite",
        items: [
            { label: "PDF Chat AI", href: "/pdf-chat", icon: "MessageSquare", badge: "NEW" },
            { label: "Compress PDF", href: "/compress-pdf", icon: "Minimize2" },
            { label: "PDF to Word", href: "/pdf-to-word", icon: "FileEdit" },
            { label: "PDF to Image", href: "/pdf-to-image", icon: "ImageIcon" },
            { label: "PDF to Excel", href: "/pdf-to-excel", icon: "BarChart2" },
            { label: "PDF to PPT", href: "/pdf-to-ppt", icon: "Monitor" },
        ],
    },
    {
        title: "Media Utilities",
        items: [
            { label: "Background Remover", href: "/bg-remover", icon: "Image", badge: "NEW" },
            { label: "HEIC Converter", href: "/heic-converter", icon: "ImageIcon" },
            { label: "AI Image Gen", href: "/ai-image-generator", icon: "Palette" },
            { label: "YouTube Insight Card", href: "/youtube-insight-card", icon: "LayoutTemplate" },
        ],
    },
];

export const featuredTools = [
    { label: "Video Downloader", href: "/youtube-downloader", icon: "Download", description: "Download any YouTube video in up to 4K quality." },
    { label: "YouTube to MP3", href: "/youtube-to-mp3", icon: "Music", description: "Convert YouTube to high-quality 320kbps MP3." },
    { label: "AI Summarizer", href: "/youtube-summarizer", icon: "Sparkles", description: "Get instant AI-generated video summaries." },
    { label: "PDF Chat", href: "/pdf-chat", icon: "MessageSquare", description: "Chat with your PDF documents using AI." },
    { label: "Background Remover", href: "/bg-remover", icon: "Image", description: "Remove image backgrounds instantly." },
];
