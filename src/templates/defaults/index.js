var context = require.context('./', true, /\.(stub)$/);

var defaultTemplates = {};
context.keys().forEach((filename)=>{
  var fileKey = filename.substring(2, filename.length - 5)
  defaultTemplates[fileKey] = context(filename).default;
});

export default defaultTemplates;