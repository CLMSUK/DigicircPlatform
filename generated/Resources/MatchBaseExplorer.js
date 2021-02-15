//////////////////////////////////////////////////////////////////////////////////////////////
//  Use this javascript file to add custom functionality to your form.                      //
//  Please read the zAppDev JS Developer Api documentation for more info and code samples.  //
//  Documentation can be found at: http://community.zappdev.com/Content/ApiReference.html   //
//////////////////////////////////////////////////////////////////////////////////////////////

var viz = null;

function updateOffers(actor) {
    
    var q = 'MATCH p=(:Actor{Id: '+ actor + '})-[*]->(:Material)-[*]->(:Actor) RETURN p';
    viz.renderWithCypher(q);
}

function updateRequests(actor) {
    
    var q = 'MATCH p=(:Actor)-[*]->(:Material)-[*]->(:Actor {Id: ' + actor +'}) RETURN p';
    viz.renderWithCypher(q);
}

function matchRequests(product, actor){
    console.log(product, actor);
    
    var q = 'MATCH p=(:Actor)-[*]->(:Material {Id: ' + product + '})-[*]->(:Actor {Id: ' + actor +'}) RETURN p'
    viz.renderWithCypher(q);
}

function matchOffers(product, actor){
    console.log(product, actor);
    
    var q = 'MATCH p=(:Actor{Id: '+ actor + '})-[*]->(:Material {Id: ' + product +'})-[*]->(:Actor) RETURN p'
    viz.renderWithCypher(q);
}

function draw(actor) {
    var config = {
      container_id: "viz",
      server_url: $form.model.Endpoint,
      server_user: "neo4j",
      server_password: "dd6VDrRwUutx72EM",
            groups: {
        Material: {
          color: {
            background: "#4c8eda",
            border: "#2870c2",
          },
          borderWidth: 1,
          borderWidthSelected: 2,
        },
        Actor: {
          color: {
            background: "#f36b1c",
            border: "#f36b1c",
          },
          borderWidth: 1,
          borderWidthSelected: 2,
        },
        Process: {
          color: {
            background: "#ffc454",
            border: "#d7a013",
          },
          borderWidth: 1,
          borderWidthSelected: 2,
        },
      },
      labels: {
        "Material": {
          "caption": "Name",
          "size": 2,
          "font": {
            "size": 16,
            "color": "#000000"
          },
          "title_properties": [
            "Name",
            "Decription",
            "HsSpecific",
          ]
        },
        "Process": {
          "caption": "Name",
          "size": 2,
          "style": {
              "shape" : "ellipse"
          },
          "font": {
            "size": 16,
            "color": "#000000"
          },
          "title_properties": [
            "Name",
            "Notes",
            "Ref"
          ]
        },
        "Actor": {
          "caption": "Name",
          "size": 2,
          "font": {
            "size": 16,
            "color": "#000000"
          },
          "title_properties": [
            "Name"
          ]
        }
      },
      relationships: {
        "OFFERED_BY": {
          thickness: "weight",
          caption: true,
          arrows: true,
          style: {
            title: 'Convert by',
            // length: 30,
            arrows: {
              to: {
                enabled: false,
              }
            },
            color: {
              highlight:'#ffc454',
              hover: '#ffc454',
              color: '#ffc454',
            },
            width: 2,
            font: {
                size: 10,
                color: "#000000"
            },
          },
          
        },
        "REQUESTED_BY": {
          thickness: "weight",
          caption: true,
          arrows: true,
          style: {
            title: 'Convert by',
            // length: 30,
            arrows: {
              to: {
                enabled: false,
              }
            },
            color: {
              highlight:'#ffc454',
              hover: '#ffc454',
              color: '#ffc454',
            },
            width: 2,
            font: {
                size: 10,
                color: "#000000"
            },
          },
          
        },
        "CONVERT_BY": {
          thickness: "weight",
          caption: true,
          style: {
            title: 'Convert by',
            // length: 30,
            arrows: {
              to: {
                enabled: false,
              }
            },
            color: {
              highlight:'#ffc454',
              hover: '#ffc454',
              color: '#ffc454',
            },
            width: 2,
            font: {
              size: 10,
              color: "#000000"
            },
          },
        },
        "CONVERTED_BY": {
              thickness: "weight",
              caption: true,
              style: {
                title: 'Convert by',
                // length: 30,
                arrows: {
                  to: {
                    enabled: false,
                  }
                },
                color: {
                  highlight:'#ffc454',
                  hover: '#ffc454',
                  color: '#ffc454',
                },
                width: 2,
                font: {
                  size: 10,
                  color: "#000000"
                },
              },
          },
      },
      // hierarchical: true,
      // hierarchical_sort_method: 'directed',
      initial_cypher: 'MATCH p=(:Actor{Id: '+ actor + '})-[*]->(:Material)-[*]->(:Actor) RETURN p'
    };
    viz = new NeoVis.default(config);
    viz.render();
}

$onFormLoaded = function() {
    console.log("Form Loaded!", $form.model);
    // console.log("Form Loaded! Model object:", $form.model);
    handleMenu();
    handleOwl();
    killFlickering();
    if($form.model.Query.SelectedActor !== null)
    {
        draw($form.model.Query.SelectedActor.Id);
    }
}
    
$formExtend = function() {
    console.log("Form extension code executed!");
}