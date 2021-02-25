var Service = require("node-windows").Service;
// Criando um novo objeto do Serviço
var svc = new Service({
    name:'Hello',
    description: 'The nodejs.org example web server.',
    script: 'C:\\Users\\hugog\\Documents\\GitHub\\ChangeStreamAuditService\\src\\Hello.js',
    env:{
      name: "NODE_ENV",
      value: "production"
    }
  });
svc.on("uninstall", function () {
  console.log("Uninstall complete.");
});
// Desistalar serviço.
svc.uninstall();
