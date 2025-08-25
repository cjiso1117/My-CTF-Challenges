function normalizeJsonData(jsonData) {
    `jsonData = {
        name: str,
        content: str (may be {title: str, content: str} json string)
    }`
    let normalizedData = [];
    for (const data of jsonData) {
        let normalized = {
            name: data.name,
            title: 'Untitled',
            content: data.content
        }
        try {
            const jsonContent = JSON.parse(data.content);
            if (jsonContent.title === undefined || jsonContent.content === undefined) {
                throw Error('not a valid note, fallback to use all content')
            }
            normalized = {
                name: data.name,
                title: jsonContent.title,
                content: jsonContent.content
            }
        } catch (error) {
            console.log('Parse Error: ' + error);
        }
        normalizedData.push(normalized)
    }

    return normalizedData;
}

export default normalizeJsonData;