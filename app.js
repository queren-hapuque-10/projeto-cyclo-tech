const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const port = 8080;
const { eAdmin } = require('./middlewares/auth');
const User = require('./models/User');
const CadProduto = require('./models/CadProduto');
const CadRecycle = require('./models/CadRecycle');
const path = require('path');
const { application } = require('express');
const { match } = require('assert');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const usuario = require("./routes/cliente")
app.use(express.json());

const rotaCliente = require("./routes/cliente"); //rota clientes
const { ClientRequest } = require('http');
const { where } = require('sequelize');
app.use('/cliente',rotaCliente);

// handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//arquivos estáticos
app.use(express.static(path.join(__dirname,"public")));

//rota do form cadastro do cliente
app.get('/cadastro',(req,res)=>{
    res.render('form');
});

//login
app.get('/login',(req,res)=>{
    res.render('login');
});

//pagina principal/inicial da loja
app.get('/',(req,res)=>{
    res.render('home');
});


//-- -- CRUD DO USER

        app.post('/cadastro',(req,res)=>{
        User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
           }).then(()=>{
            res.render('home');
       }).catch((error)=>{
            console.log("erro"+error);
       });
    });

    //opções de criar, ler, atualizar e deletar 
        app.get('/minhaconta',(req,res)=>{
        res.render('opcao');
        
        });
       
//Ler dados do user        
        app.get('/detalhes',(req,res)=>{
            res.render('preDetails');
        });
        
        app.post("/detalhes",(req,res)=>{
            User.findOne({where:{'email':req.body.email}}).then((cliente)=>{
                res.render('detailsUser',{cliente:cliente})
            });
            
        });

//Deletar user
        app.get('/deletarusuario',(req,res)=>{
            res.render('deleteUser');
        });
        
        app.post('/deletarusuario',(req,res)=>{
            User.destroy({where:{'email':req.body.email}})
            res.send("Conta deletada com sucesso!");
        });

// -- Atualizar User        
        app.get('/atualizarcadastro',(req,res)=>{
            res.render('preEdit');      
});

    app.post('/atualizarcadastro',(req,res)=>{
     User.findOne({where:{'email':req.body.email}}).then((cliente)=>{
        res.render('atualizarUser',{cliente:cliente});
    });
});

    app.post("/atualizado",(req,res)=>{
    User.update({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    },
    {where:{'email':req.body.email}},
     res.send("Atualizado com sucesso"));
});

//Rotas das paginas
app.get('/pagprodutos',(req,res)=>{
    CadProduto.findAll().then((produtos)=>{
        res.render('pagprod',{produtos:produtos});
    });
  
});

app.get('/recycle',(req,res)=>{
    res.render('recycle');
});
app.get('/ajuda',(req,res)=>{
    res.render('faq');
});
app.get('/sobre',(req,res)=>{
    res.render('sobre');
}); 


// ----> CRUD CADASTRO RECYCLE

app.post('/recycle',(req,res)=>{
    CadRecycle.create({
    nome_cliente: req.body.nome_cliente,
    cpf: req.body.cpf,
    email: req.body.email,
    descricao: req.body.descricao
       }).then(()=>{
        res.render('recycle');
   }).catch((error)=>{
        console.log("erro"+error);
   });
});

    app.get('/detalhesRec',(req,res)=>{
        res.render('PreDetailsR');
    });
    
    app.post("/detalhesRec",(req,res)=>{
        CadRecycle.findOne({where:{'email':req.body.email}}).then((cliente)=>{
            res.render('detailsRecycle',{cliente:cliente})
        }); 
    });

    app.get('/deletarRec',(req,res)=>{
        res.render('deletarRec');
    });
    
    app.post('/deletarRec',(req,res)=>{
        CadRecycle.destroy({where:{'email':req.body.email}})
        res.send("Registro deletado com sucesso!");
    });

    app.get('/atualizarRec',(req,res)=>{
        res.render('preEditRec');      
});


app.post('/atualizarRec',(req,res)=>{
 CadRecycle.findOne({where:{'email':req.body.email}}).then((cliente)=>{
    res.render('atualizarRec',{cliente:cliente});
});
});

app.post('/atualizado',(req,res)=>{
    CadRecycle.update({
        nome_cliente: req.body.nome_cliente,
        cpf: req.body.cpf,
        email: req.body.email,
        descricao: req.body.descricao,
    },
        {where:{'email': req.body.email}},
        res.send("Atualizado com sucesso")
)})


// --- > CRUD PRODUTOS

app.get('/cadastrarProduto',(req,res)=>{
        res.render('cadproduto');
       });

app.post('/cadproduto',(req,res)=>{
   CadProduto.create({
       nome: req.body.nome,
       marca: req.body.marca,
       cor: req.body.cor,
       Preco: req.body.Preco,
       descricao: req.body.descricao
   }).then(()=>{
       res.redirect('/pagprodutos');
   }).catch(function(error){
       res.send("Erro, Tente Novamente!"+error);
   });
});

// detalhes do produto
app.get('/detalhesProd',(req,res)=>{
    res.render('PreDetailsProd');
});

app.post("/detalhesProd",(req,res)=>{
    CadProduto.findOne({where:{'nome':req.body.nome}}).then((produtos)=>{
        res.render('detailsProduto',{produtos:produtos});
    }); 
});

// excluir produto 

app.get('/deletarProd',(req,res)=>{
    res.render('deleteProduto');
});

app.post('/deletarProd',(req,res)=>{
    CadProduto.destroy({where:{'nome':req.body.nome}})
    res.send("Produto deletado com sucesso!");
});


//Atualizar Produto
   app.get('/atualizarProd',(req,res)=>{
    res.render('preEditProd');      
});

app.post('/atualizarProd',(req,res)=>{
CadProduto.findOne({where:{'nome':req.body.nome}}).then((produtos)=>{
res.render('atualizarProduto',{produtos:produtos});
});
});

app.post('/atualizadoProd',(req,res)=>{
    CadProduto.update({
        nome: req.body.nome,
        marca: req.body.marca,
        cor: req.body.cor,
        Preco: req.body.Preco,
        descricao: req.body.descricao
       },
{where:{'nome':req.body.nome}},
res.send("Atualizado com sucesso!!"));
});

app.listen(port);