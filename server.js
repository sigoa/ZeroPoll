/*
 * Directory setup:
 * http://url.tld/$style/* -> ./style
 * http://url.tld/$script/* -> ./script
 * http://url.tld/$image/* -> ./image
 * Other directories must be whitelisted before use.
 * The allowed dirs are case-sensitive.
 */
var allowedDirs = {
	"style":"./style",
	"script":"./script",
	"image":"./image"
};

// Returns the real path to an allowed <path>, or empty string
function filterPath(path) {
	// Assume the path doesn't have a $
	// Check for directory name
	if (path.indexOf("/") === -1) {
		return "";
	}
	// Extract directory name
	var dir = path.slice(0,path.indexOf("/"));
	// Look for the name on the allowed list
	if (allowedDirs[dir] == null) {
		return "";
	}
	// Parse path with <dir> as /
	// This is to sandbox accesses to for example "image/../../../../dev/null".
	// if <path> is "image/../../../", "image" is allowed to "./image", zeropoll
	// is installed in "/home/myuser/zeropoll", then instead of accessing
	// "/home/myuser/zeropoll/image/../../../" it'll access "/home/myuser/zeropoll/image". 
	var pathElements = path.slice(path.indexOf("/")+1).split("/")
	var parsedPathElements = new Array();
	for (var pathElement in pathElements) {
		if (pathElement === "") {
			// what?!
		} else if (pathElement === "..") {
			// *POP*
			parsedPathElements.pop();
		} else if (pathElement == ".") {
			// ignore
		} else {
			parsedPathElements.push(pathElement);
		}
	}
	return allowedDirs[dir] + "/" + parsedPathElements.join("/");
}
