enum DateDifference {
    Day = 'day',
    Month = 'month',
    Year = 'year',
    Both = 'both',
    None = 'none',
}

function getDifference(date1: Date, date2: Date): DateDifference {
    const dayDiff = date2.getDate() - date1.getDate();
    const monthDiff = date2.getMonth() - date1.getMonth();

    const yearDiff = date2.getFullYear() - date1.getFullYear();

    if (yearDiff !== 0) {
        return DateDifference.Year;
    } else if (monthDiff !== 0) {
        return DateDifference.Month;
    } else if (dayDiff !== 0) {
        return DateDifference.Day;
    } else {
        return DateDifference.None;
    }
}

export function formatBasedOnDifference(date1: Date, date2: Date): string | null {
    const difference = getDifference(date1, date2);
    switch (difference) {
        case DateDifference.Year:
            const yearOption: Intl.DateTimeFormatOptions = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            };
            return new Intl.DateTimeFormat('en-US', yearOption).format(date1);
        case DateDifference.Month:
            const monthOption: Intl.DateTimeFormatOptions = {
                day: 'numeric',
                month: 'long',
            };
            return new Intl.DateTimeFormat('en-US', monthOption).format(date1);
        case DateDifference.Day:
            const dayOption: Intl.DateTimeFormatOptions = {
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
            };
            return new Intl.DateTimeFormat('en-US', dayOption).format(date1);

        default:
            return null;
    }
}
