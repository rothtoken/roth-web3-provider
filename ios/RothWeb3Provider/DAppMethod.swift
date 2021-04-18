// Copyright © 2017-2020 roth Wallet.
//
// This file is part of roth. The full roth copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.

import Foundation

enum DAppMethod: String, Decodable, CaseIterable {
    case signTransaction
    case signPersonalMessage
    case signMessage
    case signTypedMessage
    case ecRecover
    case requestAccounts
    case watchAsset
    case addEthereumChain
}
