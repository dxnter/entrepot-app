/* global BigInt */
import React from "react";
import extjs from "./ic/extjs.js";
import Navbar from "./components/Navbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import AlertDialog from "./components/AlertDialog";
import ConfirmDialog from "./components/ConfirmDialog";
import { StoicIdentity } from "ic-stoic-identity";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import OpenLogin from "@toruslabs/openlogin";
import { Route, Routes, useLocation } from "react-router-dom";
import Detail from "./components/Detail";
import Listings from "./components/Listings";
import BuyForm from "./components/BuyForm";
import Activity from "./components/Activity";
import Collection from "./components/Collection";
import Marketplace from "./views/Marketplace";
import Mint from "./views/Mint";
import Create from "./views/Create";
import Home from "./views/Home";
import CardTest from "./views/CardTest";
import Typography from "@material-ui/core/Typography";
import Iconic from "./views/Iconic";
import Sale from "./views/Sale";
import Contact from "./views/Contact";
//import Moonwalkers from "./components/sale/Moonwalkers";
//import DfinityBulls from "./components/sale/DfinityBulls";
//import IC3D from "./components/sale/IC3D";
//import IVC from "./components/sale/IVC";
//import HauntedHamsters from "./components/sale/HauntedHamsters";
//import Poked from "./components/sale/Poked";
//import BlockchainHeroes from "./components/sale/BlockchainHeroes";
import BTCFlower from "./components/sale/BTCFlower";
import ICSnakes from "./components/sale/ICSnakes";
import ICApes from "./components/sale/ICApes";
import ICPets from "./components/sale/ICPets";
import ICKitties from "./components/sale/ICKitties";
import SpaceApes from "./components/sale/SpaceApes";
import Opener from './components/Opener';
import ListingForm from './components/ListingForm';
import TransferForm from './components/TransferForm';
import Frog from "./components/sale/Frog";
import DfinityDeck from "./components/sale/DfinityDeck";
import Prime from "./components/sale/Prime";
import Yolo from "./components/sale/Yolo";
import Memecake from "./components/sale/Memecake";
import Cyman from "./components/sale/Cyman";
import Sword from "./components/sale/Sword";
import ICSpliffsters from "./components/sale/ICSpliffsters";
import Floki from "./components/sale/Floki";
import ICPics from "./components/sale/ICPics";
import Circle from "./components/sale/Circle";
import Interitus from "./components/sale/Interitus";
import ICAliens from "./components/sale/ICAliens";
import IVC2 from "./components/sale/IVC2";
//import Imagination from "./components/sale/Imagination";
import Tranquillity from "./components/sale/Tranquillity";
import _c from './ic/collections.js';
import legacyPrincipalPayouts from './payments.json';
import { EntrepotUpdateUSD, EntrepotUpdateLiked, EntrepotClearLiked, EntrepotUpdateStats } from './utils';
var collections = _c;
const api = extjs.connect("https://boundary.ic0.app/");
const txfee = 10000;
const txmin = 100000;
const _isCanister = c => {
  return c.length == 27 && c.split("-").length == 5;
};
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 1600,
    color: "#fff",
  },
  inner: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  content: {
    flexGrow: 1,
    marginTop: 73,
    paddingBottom:50,

  },
  footer: {
    textAlign: "center",
    bottom: 0,
    height: "100px !important",
    background: "#091216",
    color: "white",
    paddingTop: 30,
    // marginLeft : -24,
    // marginRight : -24,
    // marginBottom : -24,
    // marginTop : 80,
  },
}));
const emptyAlert = {
  title: "",
  message: "",
};
function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
const _getRandomBytes = () => {
  var bs = [];
  for (var i = 0; i < 32; i++) {
    bs.push(Math.floor(Math.random() * 256));
  }
  return bs;
};
var processingPayments = false;
var collections = collections.filter(a => _isCanister(a.canister));
const emptyListing = {
  price: "",
  tokenid: "",
};
var buttonLoader= false;
var refresher= false;
const canisterMap= {
  "fl5nr-xiaaa-aaaai-qbjmq-cai" : "jeghr-iaaaa-aaaah-qco7q-cai",
  "4nvhy-3qaaa-aaaah-qcnoq-cai" : "y3b7h-siaaa-aaaah-qcnwa-cai",
  "qcg3w-tyaaa-aaaah-qakea-cai" : "bxdf4-baaaa-aaaah-qaruq-cai",
  "d3ttm-qaaaa-aaaai-qam4a-cai" : "3db6u-aiaaa-aaaah-qbjbq-cai",
  "xkbqi-2qaaa-aaaah-qbpqq-cai" : "q6hjz-kyaaa-aaaah-qcama-cai",
};
export default function App() {
  const { pathname } = useLocation();
  const classes = useStyles();

  
  React.useEffect(() => {
    setRootPage(pathname.split("/")[1]);
    window.scrollTo(0, 0);
  }, [pathname]);
  
  
  const [buyFormData, setBuyFormData] = React.useState(emptyListing);
  const [showBuyForm, setShowBuyForm] = React.useState(false);
  const [openListingForm, setOpenListingForm] = React.useState(false);
  const [openTransferForm, setOpenTransferForm] = React.useState(false);
  const [playOpener, setPlayOpener] = React.useState(false);
  const [tokenNFT, setTokenNFT] = React.useState('');
  
  const [rootPage, setRootPage] = React.useState("");
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const [loaderText, setLoaderText] = React.useState("");
  const [alertData, setAlertData] = React.useState(emptyAlert);
  const [confirmData, setConfirmData] = React.useState(emptyAlert);
  const [showAlert, setShowAlert] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  //Account
  
  const [identity, setIdentity] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [address, setAddress] = React.useState(false);
  const [balance, setBalance] = React.useState(0);
  const [accounts, setAccounts] = React.useState(false);
  const [currentAccount, setCurrentAccount] = React.useState(0);

  const _updates = async () => {
    EntrepotUpdateUSD();
    EntrepotUpdateStats();
  };

  const _buyForm = (tokenid, price) => {
    return new Promise(async (resolve, reject) => {
      let { index, canister} = extjs.decodeTokenId(tokenid);
      setBuyFormData({
        index: index,
        canister: canister,
        tokenid: tokenid,
        price: price,
        handler: (v) => {
          setShowBuyForm(false);
          resolve(v);
          setTimeout(() => setBuyFormData(emptyListing), 100);
        },
      });
      setShowBuyForm(true);
    });
  };
  const buyNft = async (canisterId, index, listing, ah) => {
    if (balance < listing.price + 10000n)
      return alert(
        "There was an error",
        "Your balance is insufficient to complete this transaction"
      );
    var tokenid = extjs.encodeTokenId(canisterId, index);
    try {
      var answer = await _buyForm(tokenid, listing.price);
      if (!answer) {
        loader(false);
        return false;
      }
      loader(true, "Locking NFT...");
      const _api = extjs.connect("https://boundary.ic0.app/", identity);
      var r = await _api
        .canister(canisterId)
        .lock(
          tokenid,
          listing.price,
          accounts[currentAccount].address,
          _getRandomBytes()
        );
      if (r.hasOwnProperty("err")) throw r.err;
      var paytoaddress = r.ok;
      loader(true, "Transferring ICP...");
      await _api
        .token()
        .transfer(
          identity.getPrincipal(),
          currentAccount,
          paytoaddress,
          listing.price,
          10000
        );
      var r3;
      loader(true, "Settling purchase...");
      await _api.canister(canisterId).settle(tokenid);
      loader(false);
      alert(
        "Transaction complete",
        "Your purchase was made successfully - your NFT will be sent to your address shortly"
      );
      if (ah) await ah();
      return true;
    } catch (e) {
      loader(false);
      console.log(e);
      alert(
        "There was an error",
        e.Other ?? "You may need to enable cookies or try a different browser"
      );
      return false;
    }
  };
  
  const processPayments = async () => {
    loader(true, "Processing payments... (this can take a few minutes)");
    await _processPayments();
    loader(false);
  };
  
  const _processPayments = async () => {
    if (!identity) return;
    if (processingPayments) return;
    processingPayments = true;
    
    //Process legacy payments first
    if (legacyPrincipalPayouts.hasOwnProperty(identity.getPrincipal().toText())) {
      for (const canister in legacyPrincipalPayouts[identity.getPrincipal().toText()]) {
        await _processPaymentForCanister(canister);
      }
    };
    var canistersToProcess = ["pk6rk-6aaaa-aaaae-qaazq-cai","nges7-giaaa-aaaaj-qaiya-cai","jmuqr-yqaaa-aaaaj-qaicq-cai"];
    var _collections = collections.filter(a => canistersToProcess.indexOf(a.canister) >= 0);
    for (var j = 0; j < _collections.length; j++) {
      loader(true, "Processing payments... (this can take a few minutes)");
      await _processPaymentForCanister(_collections[j]);
    }
    processingPayments = false;
    return true;
  };
  const _processPaymentForCanister = async _collection => {
    if (!_collection.comaddress) return true;
    const _api = extjs.connect("https://boundary.ic0.app/", identity);
    var payments = await _api.canister(_collection.canister).payments();
    if (payments.length === 0) return true;
    if (payments[0].length === 0) return true;
    if (payments[0].length === 1) loader(true, "Payment found, processing...");
    else loader(true, "Payments found, processing...");
    var a, b, c, payment;
    for (var i = 0; i < payments[0].length; i++) {
      payment = payments[0][i];
      a = extjs.toAddress(identity.getPrincipal().toText(), payment);
      b = Number(await api.token().getBalance(a));
      c = Math.round(b * _collection.commission);
      try {
        var txs = [];
        if (b > txmin) {
          txs.push(
            _api
              .token()
              .transfer(
                identity.getPrincipal().toText(),
                payment,
                address,
                BigInt(b - (txfee + c)),
                BigInt(txfee)
              )
          );
          txs.push(
            _api
              .token()
              .transfer(
                identity.getPrincipal().toText(),
                payment,
                _collection.comaddress,
                BigInt(c - txfee),
                BigInt(txfee)
              )
          );
        }
        await Promise.all(txs);
        console.log("Payment extracted successfully");
      } catch (e) {
        console.log(e);
      }
    }
    return true;
  };
  const logout = async () => {
    localStorage.removeItem("_loginType");
    StoicIdentity.disconnect();
    setIdentity(false);
    setAccounts([]);
    setBalance(0);
  };
  var openlogin = false;
  const oauths = ['google', 'twitter', 'facebook', 'github'];
  const loadOpenLogin = async () => {
    if (!openlogin) {
      openlogin = new OpenLogin({
        clientId: "BHGs7-pkZO-KlT_BE6uMGsER2N1PC4-ERfU_c7BKN1szvtUaYFBwZMC2cwk53yIOLhdpaOFz4C55v_NounQBOfU",
        network: "mainnet",
        uxMode : 'popup',
      });
    }
    await openlogin.init();
    return openlogin;
  }
  const fromHexString = (hex) => {
    if (hex.substr(0,2) === "0x") hex = hex.substr(2);
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }
  const login = async (t) => {
    loader(true, "Connecting your wallet...");
    try {
      var id;
      switch (t) {
        case "stoic":
          id = await StoicIdentity.connect();
          if (id) {
            setIdentity(id);
            id.accounts().then((accs) => {
              setAccounts(JSON.parse(accs));
            });
            setCurrentAccount(0);
            localStorage.setItem("_loginType", t);
          } else {
            throw new Error("Failed to connect to your wallet");
          }
          break;
        case "torus":
          const openlogin = await loadOpenLogin();
          if (openlogin.privKey) {
            await openlogin.logout();
          }
          await openlogin.login();
          id = Ed25519KeyIdentity.generate(new Uint8Array(fromHexString(openlogin.privKey)));
          if (id) {
            setIdentity(id);
            setAccounts([
              {
                name: "Torus Wallet",
                address: extjs.toAddress(id.getPrincipal().toText(), 0),
              },
            ]);
            setCurrentAccount(0);
            localStorage.setItem("_loginType", t);
          } else {
            throw new Error("Failed to connect to your wallet");
          }
          break;
        case "plug":
          const result = await window.ic.plug.requestConnect({
            whitelist: collections.map(a => a.canister).concat([
              "xkbqi-2qaaa-aaaah-qbpqq-cai",
              "d3ttm-qaaaa-aaaai-qam4a-cai",
              "4nvhy-3qaaa-aaaah-qcnoq-cai",
              "qcg3w-tyaaa-aaaah-qakea-cai",
              "ryjl3-tyaaa-aaaaa-aaaba-cai",
              "qgsqp-byaaa-aaaah-qbi4q-cai",
            ]),
          });
          if (result) {
            id = await window.ic.plug.agent._identity;
            setIdentity(id);
            setAccounts([
              {
                name: "PlugWallet",
                address: extjs.toAddress(id.getPrincipal().toText(), 0),
              },
            ]);
            setCurrentAccount(0);
            localStorage.setItem("_loginType", t);
          } else {
            throw new Error("Failed to connect to your wallet");
          }
          break;
        default:
          break;
      }
    } catch (e) {
      error(e);
    }
    loader(false);
  };

  useInterval(() => EntrepotUpdateLiked(identity), 10 * 1000);
  useInterval(_updates, 10 * 60 * 1000);
  const alert = (title, message, buttonLabel) => {
    return new Promise(async (resolve, reject) => {
      setAlertData({
        title: title,
        message: message,
        buttonLabel: buttonLabel,
        handler: () => {
          setShowAlert(false);
          resolve(true);
          setTimeout(() => setAlertData(emptyAlert), 100);
        },
      });
      setShowAlert(true);
    });
  };
  const error = (e) => {
    alert("There was an error", e);
  };
  const confirm = (title, message, buttonCancel, buttonConfirm) => {
    return new Promise(async (resolve, reject) => {
      setConfirmData({
        title: title,
        message: message,
        buttonCancel: buttonCancel,
        buttonConfirm: buttonConfirm,
        handler: (v) => {
          setShowConfirm(false);
          resolve(v);
          setTimeout(() => setConfirmData(emptyAlert), 100);
        },
      });
      setShowConfirm(true);
    });
  };
  const loader = (l, t) => {
    setLoaderText(t);
    setLoaderOpen(l);
    if (!l) {
      setLoaderText("");
    }
  };

  const unpackNft = (token) => {
    setTokenNFT(token);
    setPlayOpener(true);
  };
  const closeUnpackNft = (token) => {
    setPlayOpener(false)
    setTimeout(() => setTokenNFT(''), 300);
  };
  const listNft = (token, loader, refresh) => {
    setTokenNFT(token);
    buttonLoader = loader;
    refresher = refresh;
    setOpenListingForm(true);
  }
  const transferNft = async (token, loader, refresh) => {
    setTokenNFT(token);
    buttonLoader = loader;
    refresher = refresh;
    setOpenTransferForm(true);
  };
  const closeListingForm = () => {
    setOpenListingForm(false);
    setTimeout(() => setTokenNFT(''), 300);
  };
  const closeTransferForm = () => {
    setOpenTransferForm(false);
    setTimeout(() => setTokenNFT(''), 300);
  };
  
  const unwrapNft = async (token, loader, refresh) => {
    loader(true, "Unwrapping NFT...");
    var canister = extjs.decodeTokenId(token.id).canister;
    //hot api, will sign as identity - BE CAREFUL
    var r = await extjs.connect("https://boundary.ic0.app/", identity).canister(canister).unwrap(token.id, [extjs.toSubaccount(currentAccount ?? 0)]);
    if (!r) {
      loader(false);
      return error("Couldn't unwrap!");
    }
    loader(true, "Loading NFTs...");
    if (refresh) await refresh();
    loader(false);
    return alert("Success!", "Your NFT has been unwrapped!");
  }
  const wrapAndlistNft = async (token, loader, refresh) => {
    var v = await confirm("We need to wrap this", "You are trying to list a non-compatible NFT for sale. We need to securely wrap this NFT first. Would you like to proceed?")
    if (v) {
      var decoded = extjs.decodeTokenId(token.id);
      var canister = canisterMap[decoded.canister];
      if (loader) loader(true, "Creating wrapper...this may take a few minutes");
      try{
        var r = await extjs.connect("https://boundary.ic0.app/", identity).canister(canister).wrap(token.id);
        if (!r) return error("There was an error wrapping this NFT!");
        if (loader) loader(true, "Sending NFT to wrapper...");
        var r2 = await extjs.connect("https://boundary.ic0.app/", identity).token(token.id).transfer(identity.getPrincipal().toText(), currentAccount, canister, BigInt(1), BigInt(0), "00", false);
        if (!r2) return error("There was an error wrapping this NFT!");
        if (loader) loader(true, "Wrapping NFT...");
        await extjs.connect("https://boundary.ic0.app/", identity).canister(canister).mint(token.id);
        if (!r) return error("There was an error wrapping this NFT!");
        if (loader) loader(true, "Loading NFTs...");
        if (refresh) await refresh();
        if (loader) loader(false);
        //New token id
        token.id = extjs.encodeTokenId(canister, decoded.index);
        token.canister = canister;
        token.wrapped = true;
        listNft(token, loader, refresh);
      } catch(e) {
        if (loader) loader(false);
        console.log(e);
        return error("Unknown error!");
      };
    }
  }
  
  //Form powered
  const transfer = async (id, address, loader, refresh) => {
    if (loader) loader(true, "Transferring NFT...");
    try {
      var r2 = await extjs.connect("https://boundary.ic0.app/", identity).token(id).transfer(identity.getPrincipal().toText(), currentAccount, address, BigInt(1), BigInt(0), "00", false);
      if (!r2) return error("There was an error transferring this NFT!");
      if (loader) loader(true, "Loading NFTs...");
      if (refresh) await refresh();
      if (loader) loader(false);
      return alert("Transaction complete", "Your transfer was successful!");
    } catch (e) {
      if (loader) loader(false);
      return error(e);
    };
  };
  const list = async (id, price, loader, refresh) => {
    if (loader) loader(true);
    try {
      var r = await extjs.connect("https://boundary.ic0.app/", identity).token(id).list(currentAccount, price)
      if (r) {
        if (refresh) await refresh();
        if (loader) loader(false);
        return;
      } else {        
        if (loader) loader(false);
        return;
      }
    } catch (e) {
      if (loader) loader(false);
      return error(e);
    };
  };
  
  
  React.useEffect(() => {
    var t = localStorage.getItem("_loginType");
    if (t) {
      switch (t) {
        case "stoic":
          StoicIdentity.load().then(async (identity) => {
            if (identity !== false) {
              //ID is a already connected wallet!
              setIdentity(identity);
              identity.accounts().then((accs) => {
                setAccounts(JSON.parse(accs));
              });
            } else {              
              console.log("Error from stoic connect");
            }
          }).catch(e => {
          });
          break;
        case "torus":
          loadOpenLogin().then(openlogin => {
            if (!openlogin.privKey || openlogin.privKey.length === 0) {

            } else {
              var id = Ed25519KeyIdentity.generate(new Uint8Array(fromHexString(openlogin.privKey)));
              if (id) {
                setIdentity(id);
                setAccounts([
                  {
                    name: "Torus Wallet",
                    address: extjs.toAddress(id.getPrincipal().toText(), 0),
                  },
                ]);
              };
            }
          });
          break;
        case "plug":
          (async () => {
            const connected = await window.ic.plug.isConnected();
            if (connected) {
              if (!window.ic.plug.agent) {
                await window.ic.plug.createAgent({
                  whitelist: collections.map(a => a.canister).concat([
                    "xkbqi-2qaaa-aaaah-qbpqq-cai",
                    "d3ttm-qaaaa-aaaai-qam4a-cai",
                    "qcg3w-tyaaa-aaaah-qakea-cai",
                    "4nvhy-3qaaa-aaaah-qcnoq-cai",
                    "ryjl3-tyaaa-aaaaa-aaaba-cai",
                    "qgsqp-byaaa-aaaah-qbi4q-cai",
                  ]),
                });
              }
              var id = await window.ic.plug.agent._identity;
              setIdentity(id);
              setAccounts([
                {
                  name: "Plug Wallet",
                  address: extjs.toAddress(id.getPrincipal().toText(), 0),
                },
              ]);
            }
          })();
          break;
        default:
          break;
      }
    }
    EntrepotUpdateUSD();
    EntrepotUpdateStats();
    if (identity) EntrepotUpdateLiked(identity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (identity) {
      setLoggedIn(true);
      setAddress(extjs.toAddress(identity.getPrincipal().toText(), 0));
      //This is where we check for payments
      if (legacyPrincipalPayouts.hasOwnProperty(identity.getPrincipal().toText())) {
        for (const canister in legacyPrincipalPayouts[identity.getPrincipal().toText()]) {
          if (legacyPrincipalPayouts[identity.getPrincipal().toText()][canister].length) {
            //alert("You have payments owing, please use the Check Payments button");
            break;
          };
        }
      };
      EntrepotUpdateLiked(identity)
    } else {
      EntrepotClearLiked()
      setLoggedIn(false);
      setAddress(false);
      setAccounts(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);
  const footer = (
  <div className={classes.footer}>
    <Typography variant="body1">
      Developed by ToniqLabs &copy; All rights reserved 2021<br /><a href="https://docs.google.com/document/d/13aj8of_UXdByGoFdMEbbIyltXMn0TXHiUie2jO-qnNk/edit" target="_blank">Terms of Service</a>
    </Typography>
  </div>);
  
  return (
    <>
      <Navbar view={rootPage} processPayments={processPayments} setBalance={setBalance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} loader={loader} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts} />
      <main className={classes.content}>
        <div className={classes.inner}>
          <Routes>
            <Route path="/marketplace/asset/:tokenid" exact element={
              <Detail
                error={error}
                alert={alert}
                confirm={confirm}
                loggedIn={loggedIn} 
                list={list}
                unpackNft={unpackNft} 
                listNft={listNft} 
                wrapAndlistNft={wrapAndlistNft} 
                unwrapNft={unwrapNft} 
                transferNft={transferNft} 
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts} buyNft={buyNft}
              />} />
            <Route path="/marketplace/:route/activity" exact element={
              <Activity
                error={error}
                view={"listings"}
                alert={alert}
                confirm={confirm}
                loggedIn={loggedIn} 
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/marketplace/:route" exact element={
              <Listings
                error={error}
                view={"listings"}
                alert={alert}
                confirm={confirm}
                loggedIn={loggedIn} 
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts} buyNft={buyNft}
              />} />
            <Route path="/marketplace" exact element={
              <Marketplace
                error={error}
                view={"collections"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/favorites" exact element={
              <Collection
                error={error}
                view={"favorites"}
                alert={alert}
                confirm={confirm}
                loggedIn={loggedIn} 
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/selling" exact element={
              <Collection
                error={error}
                view={"selling"}
                alert={alert}
                list={list}
                unpackNft={unpackNft} 
                listNft={listNft} 
                wrapAndlistNft={wrapAndlistNft} 
                unwrapNft={unwrapNft} 
                transferNft={transferNft} 
                confirm={confirm}
                loggedIn={loggedIn} 
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/offers-made" exact element={
              <Collection
                error={error}
                view={"offers-made"}
                alert={alert}
                confirm={confirm}
                loggedIn={loggedIn} 
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/offers-received" exact element={
              <Collection
                error={error}
                view={"offers-received"}
                alert={alert}
                list={list}
                unpackNft={unpackNft} 
                listNft={listNft} 
                wrapAndlistNft={wrapAndlistNft} 
                unwrapNft={unwrapNft} 
                transferNft={transferNft} 
                confirm={confirm}
                loggedIn={loggedIn} 
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/collected" exact element={
              <Collection
                error={error}
                view={"collected"}
                alert={alert}
                confirm={confirm}
                loggedIn={loggedIn} 
                unpackNft={unpackNft} 
                listNft={listNft} 
                wrapAndlistNft={wrapAndlistNft} 
                unwrapNft={unwrapNft} 
                transferNft={transferNft} 
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/btcflower" exact element={
              <BTCFlower
                error={error}
                view={"sale"}
                sale={"btcflower"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/yolo-octopus" exact element={
              <Yolo
                error={error}
                view={"sale"}
                sale={"yolo-octopus"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/sword" exact element={
              <Sword
                error={error}
                view={"sale"}
                sale={"sword"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/icpics" exact element={
              <ICPics
                error={error}
                view={"sale"}
                sale={"icpics"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/icspliffsters" exact element={
              <ICSpliffsters
                error={error}
                view={"sale"}
                sale={"icspliffsters"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/interitus" exact element={
              <Interitus
                error={error}
                view={"sale"}
                sale={"interitus"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/frogvoxel" exact element={
              <Frog
                error={error}
                view={"sale"}
                sale={"frogvoxel"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/prime8s" exact element={
              <Prime
                error={error}
                view={"sale"}
                sale={"prime8s"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/ivc2" exact element={
              <IVC2
                error={error}
                view={"sale"}
                sale={"ivc2"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/Cyman" exact element={
              <Cyman
                error={error}
                view={"sale"}
                sale={"Cyman"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/dfinitydeck" exact element={
              <DfinityDeck
                error={error}
                view={"sale"}
                sale={"dfinitydeck"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/ickitties" exact element={
              <ICKitties
                error={error}
                view={"sale"}
                sale={"icpets"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/floki" exact element={
              <Floki
                error={error}
                view={"sale"}
                sale={"floki"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/icircle" exact element={
              <Circle
                error={error}
                view={"sale"}
                sale={"icircle"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/icpets" exact element={
              <ICPets
                error={error}
                view={"sale"}
                sale={"icpets"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/memecake" exact element={
              <Memecake
                error={error}
                view={"sale"}
                sale={"memecake"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/tranquillity" exact element={
              <Tranquillity
                error={error}
                view={"sale"}
                sale={"tranquillity"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/icapes" exact element={
              <ICApes
                error={error}
                view={"sale"}
                sale={"icapes"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/icaliens" exact element={
              <ICAliens
                error={error}
                view={"sale"}
                sale={"icaliens"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/icsnakes" exact element={
              <ICSnakes
                error={error}
                view={"sale"}
                sale={"icsnakes"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/sale/spaceapes" exact element={
              <SpaceApes
                error={error}
                view={"sale"}
                sale={"spaceapes"}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/mint" exact element={
              <Mint
                error={error}
                alert={alert}
                confirm={confirm}
                loader={loader} address={address} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/create" exact element={
              <Create
                error={error}
                alert={alert}
                confirm={confirm}
                loader={loader} balance={balance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/contact" exact element={
              <Contact
                error={error}
                error={error}
                alert={alert}
                confirm={confirm}
                loader={loader} setBalance={setBalance} identity={identity}  account={accounts.length > 0 ? accounts[currentAccount] : false} logout={logout} login={login} collections={collections} collection={false} currentAccount={currentAccount} changeAccount={setCurrentAccount} accounts={accounts}
              />} />
            <Route path="/" exact element={
              <Home error={error} alert={alert} confirm={confirm} loader={loader} />} />
            <Route path="/sale" exact element={
              <Sale error={error} alert={alert} confirm={confirm} loader={loader} />} />
          </Routes>
          <BuyForm open={showBuyForm} {...buyFormData} />
          <TransferForm refresher={refresher} buttonLoader={buttonLoader} transfer={transfer} alert={alert} open={openTransferForm} close={closeTransferForm} loader={loader} error={error} nft={tokenNFT} />
          <ListingForm refresher={refresher} buttonLoader={buttonLoader} collections={collections} list={list} alert={alert} open={openListingForm} close={closeListingForm} loader={loader} error={error} nft={tokenNFT} />
          <Opener alert={alert} nft={tokenNFT} identity={identity} currentAccount={currentAccount} open={playOpener} onEnd={closeUnpackNft} />
        </div>
      </main>
      {footer}
      
      <Backdrop className={classes.backdrop} open={loaderOpen}>
        <CircularProgress color="inherit" />
        <h2 style={{ position: "absolute", marginTop: "120px" }}>
          {loaderText ?? "Loading..."}
        </h2>
      </Backdrop>
      <AlertDialog
        open={showAlert}
        title={alertData.title}
        message={alertData.message}
        buttonLabel={alertData.buttonLabel}
        handler={alertData.handler}
      />
      <ConfirmDialog
        open={showConfirm}
        title={confirmData.title}
        message={confirmData.message}
        buttonCancel={confirmData.buttonCancel}
        buttonConfirm={confirmData.buttonConfirm}
        handler={confirmData.handler}
      />
    </>
  );
}
