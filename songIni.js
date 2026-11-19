// Reads a song's metadata from the song.ini in its chart's folder, as Clone Hero reads it
const fs = require("fs");
const path = require("path");

// Decodes song.ini text as Clone Hero does: a byte order mark picks UTF-16 or UTF-8, other text is UTF-8 when it's
// valid UTF-8, and Latin-1 otherwise
function decode(bytes) {
	if (bytes[0] == 0xFF && bytes[1] == 0xFE) return new TextDecoder("utf-16le").decode(bytes);
	if (bytes[0] == 0xFE && bytes[1] == 0xFF) return new TextDecoder("utf-16be").decode(bytes);
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	} catch (err) {
		return bytes.toString("latin1");
	}
}

// The values in the [song] section of the song.ini beside the chart file, by their keys in lowercase, or null when the
// chart's folder has no song.ini or its song.ini has no [song] values
function readSongSection(chartPath) {
	const folder = path.dirname(chartPath);
	const fileName = fs.readdirSync(folder).find(file => file.toLowerCase() == "song.ini");
	if (fileName === undefined) return null;

	let section = null;
	let values = null;
	for (let line of decode(fs.readFileSync(path.join(folder, fileName))).split(/\r?\n/)) {
		line = line.trim();
		if (line == "" || line.startsWith(";") || line.startsWith("#")) continue;

		if (line.startsWith("[") && line.endsWith("]")) {
			section = line.slice(1, -1).toLowerCase();
		} else if (section == "song" && line.includes("=")) {
			const equals = line.indexOf("=");
			if (values === null) values = {};
			values[line.slice(0, equals).trim().toLowerCase()] = line.slice(equals + 1).trim();
		}
	}
	return values;
}

// The song's name and artist from song.ini's [song] values, or from the chart's when its folder has no song.ini. As in
// Clone Hero, a missing or blank value is "Unknown Name" or "Unknown Artist".
function nameAndArtist(values) {
	const known = (value, unknown) => value === undefined || value.trim() == "" ? unknown : value;
	return { name: known(values.name, "Unknown Name"), artist: known(values.artist, "Unknown Artist") };
}

module.exports = { readSongSection, nameAndArtist };
