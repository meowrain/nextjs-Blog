export default function getFormattedDate(dateString: string): string {
    return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(new Date(dateString))
}