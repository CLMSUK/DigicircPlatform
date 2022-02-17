//////////////////////////////////////////////////////////////////////////////////////////////
//  Use this javascript file to add custom functionality to your form.                      //
//  Please read the zAppDev JS Developer Api documentation for more info and code samples.  //
//  Documentation can be found at: http://community.zappdev.com/Content/ApiReference.html   //
//////////////////////////////////////////////////////////////////////////////////////////////

var viz = null;

function update(waste, product) {
    console.log(waste, product);
    var maxResults = 100

    var wasteQ = "";    
    if (waste != 0) {
        wasteQ = '{ Id: ' + waste + ' }';
    }
    
    var productQ = "";
    if (product != 0) {
        productQ =  '{ Id: ' + product + ' }';
    }

    var q = 'MATCH p=(:Material ' + wasteQ + ' )-[:CONVERT_BY|CONVERTED_BY*]->(m:Material ' + productQ + ') RETURN p LIMIT ' + maxResults;
    viz.renderWithCypher(q);
}

function match(product, actor){
    console.log(product, actor);
    
    var q = 'MATCH p=(:Actor)-[*]->(:Material {Id: ' + product + '})-[*]->(consumer:Actor {Id: ' + actor + '}) WHERE NOT (consumer)-->() RETURN p';
    viz.renderWithCypher(q);
}

function draw() {
    var config = {
      container_id: "viz",
      server_url: $form.model.Endpoint,
      server_user: "neo4j",
      server_password: "dd6VDrRwUutx72EM",
      encrypted: "ENCRYPTION_ON",
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
          shape: 'text',
          color: {
            background: "#ffc454",
            border: "#d7a013",
          },
          borderWidth: 1,
          borderWidthSelected: 2,
        },
      },
      labels: {
        Material: {
          caption: "Name",
          size: 2,
          font: {
            size: 16,
            color: "#000000"
          },
          title_properties: [
            "Name",
            "Decription",
            "HsSpecific",
          ]
        },
        Process: {
          caption: "Name",
          size: 1,
          font: {
            size: 16,
            color: "#000000"
          },
          title_properties: [
            "Name",
            "Notes",
            "Ref"
          ]
        }
      },
      relationships: {
        OFFERED_BY: {
          thickness: "weight",
          caption: false,
          arrows: true,
          font: {
            size: 16,
            color: "#000000"
          },
        },
        REQUESTED_BY: {
          thickness: "weight",
          caption: false,
          arrows: true,
          font: {
            size: 16,
            color: "#000000"
          },
        },
        CONVERT_BY: {
          thickness: "weight",
          caption: false,
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
              size: 16,
              color: "#000000"
            },
          },
        },
        CONVERTED_BY: {
          thickness: "weight",
          caption: false,
          arrows: true,
          style: {
            title: 'Converted by',
            // length: 30,
            color: {
              highlight:'#ffc454',
              hover: '#ffc454',
              color: '#ffc454',
            },
            width: 2,
            font: {
              size: 16,
              color: "#000000"
            },
          },
        }
      },
      // hierarchical: true,
      // hierarchical_sort_method: 'directed',
      initial_cypher: 'MATCH p=(:Material)-[:CONVERT_BY|CONVERTED_BY*]->(m:Material) RETURN p LIMIT 100'
    };
    viz = new NeoVis.default(config);
    viz.render();
}

function gtag(){
    dataLayer.push(arguments);
}

var measureGoogleAnalytics = function() {
   window.dataLayer = window.dataLayer || [];
  
  gtag('js', new Date());

  var id = $form.model.AnalyticsId;
  gtag('config', id);
};

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

$onFormLoaded = function() {
    console.log("Form Loaded!", $form.model);
    // console.log("Form Loaded! Model object:", $form.model);
    handleMenu();
    handleOwl();
    killFlickering();
    draw();
}
    
$formExtend = function() {
    console.log("Form extension code executed!");
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + $form.model.AnalyticsId, measureGoogleAnalytics);
}