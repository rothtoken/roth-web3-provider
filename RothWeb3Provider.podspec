#
# Be sure to run `pod lib lint rothWeb3Provider.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'rothWeb3Provider'
  s.version          = '0.4.0'
  s.summary          = 'Web3 javascript wrapper provider for iOS and Android platforms.'

  s.description      = <<-DESC
  Web3 javascript wrapper provider for iOS and Android platforms.
  The magic behind the dApps browsers
                       DESC

  s.homepage         = 'https://github.com/rothWallet/roth-web3-provider'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.source           = { :git => 'https://github.com/rothWallet/roth-web3-provider.git', :tag => s.version.to_s }
  s.social_media_url = 'https://twitter.com/rothwalletapp'

  s.ios.deployment_target = '8.0'

  s.resource_bundles = {
    'rothWeb3Provider' => ['dist/roth-min.js']
  }
end
