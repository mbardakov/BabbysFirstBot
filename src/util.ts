// utilities for commonly used functionality
// e.g. string parsing and manipulation

export class Util {
    /**
     * returns true if target occurs in source at least once, ignoring capitalization and whitespace
     */
    public static flexContains = (source: string, target: string): boolean => {
        return source.replace(/\s/g,'').toLowerCase().indexOf(target.replace(/\s/g,'')) >= 0;
    }

    /**
     * given a command and a list of space-separated arguments,
     * returns an array of just the arguments,
     * but does not space-separate anything surrounded by double-quotes (")
     */
    public static scanArgs = (message: string): string[] => {
        // https://stackoverflow.com/questions/23582276/split-string-by-comma-but-ignore-commas-inside-quotes/23582323
        let res = message.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
        return res.map(word=>word.replace(/"/g,'')).slice(1);
    }

    /**
     * deprecated: given a command and a list of space-separated arguments,
     * returns an array of the arguments;
     * does not do anything special for quotes
     */
    public static scanArgsSimple = (message: string): string[] => {
        let args = message.split(' ').slice(1);
        return args;
    }

    /**
     * converts a song's link to the corresponding spotify URI
     */
    public static parseSong = (link: string) => {
        // TODO: this would be cooler with a regex
        // song link: https://open.spotify.com/track/2WfaOiMkCvy7F5fcp2zZ8L?si=s6SR34JmS-OCMZTSvKoIXQ
        // song spotify URI: spotify:track:2WfaOiMkCvy7F5fcp2zZ8L (you can parse this)
        let start = link.indexOf('/track/') + 7;
        let end = link.lastIndexOf('?');
        let uri = link.substring(start, end);
        return `spotify:track:${uri}`;
    }
}