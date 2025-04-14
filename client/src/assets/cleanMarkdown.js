const cleanMarkdown = (text = "") => {
    return text
      .replace(/^\*\* ?/, "")                          // remove leading bold markdown
      .replace(/(\d+\. )/g, "\n$1")                    // add line break before numbered items
      .replace(/([a-z])(\n\d+\. )/gi, "$1\n$2")         // ensure newline before list numbering
      .trim();
  };
  

export default cleanMarkdown;
  