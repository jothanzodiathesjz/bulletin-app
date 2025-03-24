import type { EmojiAttributes } from "@/domain/Emoji";

/**
 * Fungsi untuk menghasilkan teks yang menampilkan format reaksi emoji
 * dengan format "[name1] dan [name2] dan X lainnya" untuk jumlah lebih dari 2,
 * atau format lain yang sesuai untuk jumlah kurang dari 3.
 * 
 * @param {EmojiAttributes[]} reactions - Array berisi reaksi emoji 
 * @param {string} emojiType - Opsional: filter berdasarkan jenis emoji tertentu
 * @returns {string} - String yang menampilkan informasi reaksi
 */
export function formatReactions(reactions: EmojiAttributes[], emojiType?: string): string {
    // Filter berdasarkan jenis emoji jika parameter emojiType diberikan
    let filteredReactions = reactions;
    if (emojiType) {
        filteredReactions = reactions.filter(reaction => reaction.emoji === emojiType);
    }

    // Jika tidak ada reaksi
    if (!filteredReactions || filteredReactions.length === 0) {
        return "Belum ada reaksi";
    }

    // Ekstrak nama-nama pengguna dari reaksi
    const userNames = filteredReactions.map(reaction => reaction.user.username);

    // Jika hanya 1 orang yang bereaksi
    if (userNames.length === 1) {
        return `${userNames[0]} bereaksi`;
    }

    // Jika hanya 2 orang yang bereaksi
    if (userNames.length === 2) {
        return `${userNames[0]} dan ${userNames[1]} bereaksi`;
    }

    // Jika lebih dari 2 orang yang bereaksi
    const lainnya = userNames.length - 2;
    return `${userNames[0]} dan ${userNames[1]} dan ${lainnya} lainnya`;
}

/**
 * Fungsi untuk mendapatkan ringkasan dari semua jenis reaksi emoji
 * dan jumlah pengguna untuk masing-masing jenis
 * 
 * @param {EmojiAttributes[]} reactions - Array berisi reaksi emoji
 * @returns {object} - Object dengan emoji sebagai key dan jumlah sebagai value
 */
export function getEmojiSummary(reactions: EmojiAttributes[]): Record<string, number> {
    const summary: Record<string, number> = {};

    reactions.forEach(reaction => {
        const emoji = reaction.emoji;
        if (summary[emoji]) {
            summary[emoji]++;
        } else {
            summary[emoji] = 1;
        }
    });

    return summary;
}

/**
 * Fungsi untuk menghasilkan string yang menampilkan semua jenis reaksi 
 * dengan jumlahnya
 * 
 * @param {EmojiAttributes[]} reactions - Array berisi reaksi emoji
 * @returns {string} - String yang menampilkan semua jenis reaksi dan jumlahnya
 */
export function formatAllReactions(reactions: EmojiAttributes[]): string {
    const summary = getEmojiSummary(reactions);

    if (Object.keys(summary).length === 0) {
        return "Belum ada reaksi";
    }

    const formattedReactions = Object.entries(summary)
        .map(([emoji, count]) => `${emoji} ${count}`)
        .join(" · ");

    return formattedReactions;
}