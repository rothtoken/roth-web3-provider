// Copyright © 2017-2020 roth Wallet.
//
// This file is part of roth. The full roth copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.

"use strict";

var ethUtil = require("ethereumjs-util");
require("../index");
const roth = window.roth;
const Web3 = require("web3");

const mainnet = {
  address: "0x9d8A62f656a8d1615C1294fd71e9CFb3E4855A4F",
  chainId: 1,
  rpcUrl: "https://mainnet.infura.io/v3/6e822818ec644335be6f0ed231f48310",
};

const ropsten = {
  address: "0x9d8A62f656a8d1615C1294fd71e9CFb3E4855A4F",
  chainId: 3,
  rpcUrl: "https://ropsten.infura.io/apikey",
};

const bsc = {
  address: "0x9d8A62f656a8d1615C1294fd71e9CFb3E4855A4F",
  chainId: 56,
  rpcUrl: "https://bsc-dataseed1.binance.orge",
};

describe("rothWeb3Provider constructor tests", () => {
  test("test constructor.name", () => {
    const provider = new rothwallet.Provider({});
    const web3 = new rothwallet.Web3(provider);
    expect(web3.currentProvider.constructor.name).toBe("rothWeb3Provider");
  });

  test("test setAddress", () => {
    const provider = new rothwallet.Provider({
      chainId: 1,
      rpcUrl: "",
    });
    const address = mainnet.address;
    expect(provider.address).toBe("");

    provider.setAddress(address);
    expect(provider.address).toBe(address.toLowerCase());
    expect(provider.ready).toBeTruthy();
  });

  test("test setConfig", (done) => {
    const provider = new rothwallet.Provider(ropsten);
    const web3 = new Web3(provider);

    expect(web3.currentProvider.chainId).toEqual(3);

    web3.currentProvider.setConfig(mainnet);
    expect(web3.currentProvider.chainId).toEqual(1);
    expect(web3.currentProvider.rpc.rpcUrl).toBe(mainnet.rpcUrl);

    expect(provider.request).not.toBeUndefined;
    expect(provider.on).not.toBeUndefined;

    web3.version.getNetwork((error, id) => {
      expect(id).toBe("1");
      done();
    });
  });

  test("test eth_chainId", (done) => {
    const provider = new rothwallet.Provider(bsc);
    const web3 = new Web3(provider);

    let request = { jsonrpc: "2.0", method: "eth_chainId", id: 123 };

    provider.request(request).then((chainId) => {
      expect(chainId).toEqual("0x38");
      done();
    });

    const response = web3.currentProvider.send(request);
    expect(response.result).toBe("0x38");

    web3.currentProvider.sendAsync(request, (error, result) => {
      expect(result.result).toEqual("0x38");
      done();
    });
  });

  test("test eth_accounts", (done) => {
    const provider = new rothwallet.Provider(mainnet);
    const web3 = new Web3(provider);
    const addresses = ["0x9d8a62f656a8d1615c1294fd71e9cfb3e4855a4f"];

    web3.eth.getAccounts((error, accounts) => {
      expect(accounts).toEqual(addresses);
      done();
    });

    provider.request({ method: "eth_accounts" }).then((accounts) => {
      expect(accounts).toEqual(addresses);
      done();
    });

    web3.currentProvider.sendAsync(
      { method: "eth_accounts" },
      (error, data) => {
        expect(data.result).toEqual(addresses);
        done();
      }
    );
  });

  test("test eth_sign", (done) => {
    const provider = new rothwallet.Provider(mainnet);
    const web3 = new Web3(provider);
    const addresses = ["0x9d8a62f656a8d1615c1294fd71e9cfb3e4855a4f"];
    const signed =
      "0x730ec377cfc7090e08366fad4758aad721dbb51e187efe45426a7e56d1ff053947ab1a7b0bd7b138c48a9f3d3b92bd83f4265abbe9876930faaf7fbb980b219d1c";

    rothwallet.postMessage = (message) => {
      provider.sendResponse(message.id, signed);
    };

    var hash = ethUtil.keccak256(
      Buffer.from("An amazing message, for use with MetaMask!", "utf8")
    );
    var hex = "0x" + hash.toString("hex");
    web3.eth.sign(addresses[0], hex, (err, result) => {
      expect(result).toEqual(signed);
      done();
    });
  });

  test("test personal_sign", (done) => {
    const provider = new rothwallet.Provider(bsc);
    const signed =
      "0xf3a9e21a3238b025b7edf5013876548cfb2f2a838aca573de88c91ea9aecf7190cd6330a0172bd5d106841647831f30065f644eddc2f86091e1bb370c9ff833f1c";

    rothwallet.postMessage = (message) => {
      const buffer = Buffer.from(message.object.data);
      if (buffer.length === 0) {
        throw new Error("message is not hex!");
      }
      provider.sendResponse(message.id, signed);
    };

    const request = {
      method: "personal_sign",
      params: [
        '{"version":"0.1.2","timestamp":"1602823075","token":"0x4b0f1812e5df2a09796481ff14017e6005508003","type":"vote","payload":{"proposal":"QmSV53XuYi28XfdNHDhBVp2ZQwzeewQNBcaDedRi9PC6eY","choice":1,"metadata":{}}}',
        "0x9d8A62f656a8d1615C1294fd71e9CFb3E4855A4F",
      ],
      id: 1602823075454,
    };

    expect(Buffer.from(request.params[0], "hex").length).toEqual(0);

    provider.request(request).then((result) => {
      expect(result).toEqual(signed);
      done();
    });
  });
}); // end of top describe()
