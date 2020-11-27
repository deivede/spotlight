function tira() {
  var ht = document.getElementById("hide");
  if( ht.style.display === "block") {
    ht.style.display = "none"
  } else {
    ht.style.display = "block"
  }
}

async function mdl_ig() {

    const obj = await fetch('/dbusr_ig', {method: "GET"})
    const user = await obj.json();



    console.log(user);



    class Exb extends React.Component {

     render() {
      return(
        <button id="btn" onClick={() => tira()}>Instagram<span>{this.props.total}</span></button>
        )
     }
}

    class Modulo_ig extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
              nw_stry: 0,
              ttsty: "",
              opc: 0.3,
              vsb: "hidden"
            }
            this.stry_state = this.stry_state.bind(this);
            this.bdr = this.bdr.bind(this);
        }

        bdr() {
         this.setState({ttsty: "0px"});
       }

        stry_state(load) {
            var usr_ig = this.props.ids;

            const data = (response) => {
                {
                    if (response.ok) {
                        response.json().then(dt => {
                            var novostry = dt.stry;
                            console.log(novostry);

                            if (load === true) {
                              this.setState({nw_stry: novostry});
                              if(this.state.nw_stry !== 0) {
                                this.setState({vsb: "visible"})
                              }
                            } else {

                            if(novostry > this.state.nw_stry) {
                                this.setState({ttsty: "3px solid red"});
                                this.setState({opc: 1});
                                var sub = novostry - this.state.nw_stry
                                this.setState({nw_stry: this.state.nw_stry + sub });
                                this.setState({vsb: "visible"});
                            }
                          }
                    }) } else {
                        console.log("error");
                    }
                }
            }

            async function render_stry() {
                let reqstry = await fetch("/ig", {
                    method: "POST",
                    credentials: "include",
                    body: usr_ig,
                    cache: "no-cache",
                    headers: new Headers({
                        "content-type": "application/json"
                    })

                });
                console.log(data(reqstry));
                return data(reqstry);
            }

           render_stry();



        }


        componentDidMount() {


          this.stry_state(true);


          setInterval(() => this.stry_state(false), 300000);
        }


        render() {
            return (
              <div className="ilc">
              <div className="box">
                <div>
                <a href={this.props.links} target="_blank" >
                  <img src={this.props.pics}  className="clip"
                  onClick={this.bdr}
                  style={{opacity: this.state.opc}}/>
                  </a>
               </div>
              <div className="dot3" style={{border: this.state.ttsty, visibility: this.state.vsb}} onClick={this.bdr}>
                <div className="not">
                {this.state.nw_stry}
                </div>
              </div>
            </div>
        </div>
      )
        }
    }

    ReactDOM.render(
      <div>
      <Exb />
        <div id="hide">
            <Modulo_ig pics={user.usr_ig.rique_cardoso_.pic[0]}  ids={user.usr_ig.rique_cardoso_.id[0]} links={user.usr_ig.rique_cardoso_.link[0]}/>
            <Modulo_ig pics={user.usr_ig.kainalacerda.pic[0]}  ids={user.usr_ig.kainalacerda.id[0]} links={user.usr_ig.kainalacerda.link[0] }/>
            <Modulo_ig pics={user.usr_ig.werneck_tati.pic[0]}  ids={user.usr_ig.werneck_tati.id[0]} links={user.usr_ig.werneck_tati.link[0]}/>
            <Modulo_ig pics={user.usr_ig.ca_momille.pic[0]}  ids={user.usr_ig.ca_momille.id[0]} links={user.usr_ig.ca_momille.link[0]}/>
            <Modulo_ig pics={user.usr_ig.nath_ayres.pic[0]}  ids={user.usr_ig.nath_ayres.id[0]} links={user.usr_ig.nath_ayres.link[0]}/>
            <Modulo_ig pics={user.usr_ig.larissesposito.pic[0]}  ids={user.usr_ig.larissesposito.id[0]} links={user.usr_ig.larissesposito.link[0]}/>
            <Modulo_ig pics={user.usr_ig.cecihadassa.pic[0]}  ids={user.usr_ig.cecihadassa.id[0]} links={user.usr_ig.cecihadassa.link[0]}/>
            <Modulo_ig pics={user.usr_ig.tainasoaresc.pic[0]}  ids={user.usr_ig.tainasoaresc.id[0]} links={user.usr_ig.tainasoaresc.link[0]}/>
            <Modulo_ig pics={user.usr_ig.brunarochaamorim.pic[0]} ids={user.usr_ig.brunarochaamorim.id[0]} links={user.usr_ig.brunarochaamorim.link[0]}/>
            <Modulo_ig pics={user.usr_ig.bacanna_tattoo.pic[0]}  ids={user.usr_ig.bacanna_tattoo.id[0]} links={user.usr_ig.bacanna_tattoo.link[0]}/>
            <Modulo_ig pics={user.usr_ig._aninhamr_.pic[0]} ids={user.usr_ig._aninhamr_.id[0]} links={user.usr_ig._aninhamr_.link[0]}/>
            <Modulo_ig pics={user.usr_ig.anna_bacanna.pic[0]} ids={user.usr_ig.anna_bacanna.id[0]} links={user.usr_ig.anna_bacanna.link[0]}/>
            <Modulo_ig pics={user.usr_ig.celadeoliveira.pic[0]} ids={user.usr_ig.celadeoliveira.id[0]} links={user.usr_ig.celadeoliveira.link[0]}/>
            <Modulo_ig pics={user.usr_ig.juu_lunardi.pic[0]}  ids={user.usr_ig.juu_lunardi.id[0]} links={user.usr_ig.juu_lunardi.link[0]}/>
            <Modulo_ig pics={user.usr_ig.lucollyer.pic[0]}  ids={user.usr_ig.lucollyer.id[0]} links={user.usr_ig.lucollyer.link[0]}/>
            <Modulo_ig pics={user.usr_ig.saraecheagaray.pic[0]}  ids={user.usr_ig.saraecheagaray.id[0]} links={user.usr_ig.saraecheagaray.link[0]}/>
            <Modulo_ig pics={user.usr_ig.ceelaribeiro.pic[0]}  ids={user.usr_ig.ceelaribeiro.id[0]} links={user.usr_ig.ceelaribeiro.link[0]}/>
            <Modulo_ig pics={user.usr_ig.niccsz.pic[0]}  ids={user.usr_ig.niccsz.id[0]} links={user.usr_ig.niccsz.link[0]}/>
            <Modulo_ig pics={user.usr_ig.deborasecoalmeida.pic[0]}  ids={user.usr_ig.deborasecoalmeida.id[0]} links={user.usr_ig.deborasecoalmeida.link[0]}/>
            <Modulo_ig pics={user.usr_ig.willthetraveler.pic[0]}  ids={user.usr_ig.willthetraveler.id[0]} links={user.usr_ig.willthetraveler.link[0]}/>
            <Modulo_ig pics={user.usr_ig.aninha_sousa27.pic[0]}  ids={user.usr_ig.aninha_sousa27.id[0]} links={user.usr_ig.aninha_sousa27.link[0]}/>
            <Modulo_ig pics={user.usr_ig.fernandasaffi.pic[0]}  ids={user.usr_ig.fernandasaffi.id[0]} links={user.usr_ig.fernandasaffi.link[0]}/>
            <Modulo_ig pics={user.usr_ig.ofamosopachecao.pic[0]}  ids={user.usr_ig.ofamosopachecao.id[0]} links={user.usr_ig.ofamosopachecao.link[0]}/>
            <Modulo_ig pics={user.usr_ig.gabemelos.pic[0]}  ids={user.usr_ig.gabemelos.id[0]} links={user.usr_ig.gabemelos.link[0]}/>
            <Modulo_ig pics={user.usr_ig.ruliadantas.pic[0]}  ids={user.usr_ig.ruliadantas.id[0]} links={user.usr_ig.ruliadantas.link[0]}/>
            <Modulo_ig pics={user.usr_ig.bbr_oliveira.pic[0]}  ids={user.usr_ig.bbr_oliveira.id[0]} links={user.usr_ig.bbr_oliveira.link[0]}/>
            <Modulo_ig pics={user.usr_ig.rliaju.pic[0]}  ids={user.usr_ig.rliaju.id[0]} links={user.usr_ig.rliaju.link[0]}/>
            <Modulo_ig pics={user.usr_ig._soytha.pic[0]}  ids={user.usr_ig._soytha.id[0]} links={user.usr_ig._soytha.link[0]}/>
      </div>
      </div>,
     document.getElementById("render_ig")
   );

 }

 mdl_ig();
