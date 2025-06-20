'use client';

import React, { useState } from 'react';
import {
  useTonConnectUI,
  useTonAddress,
} from '@tonconnect/ui-react';
import { beginCell, JettonMaster, TonClient } from '@ton/ton';
import { Address, toNano } from '@ton/core';
import { useModalStore } from '@/lib/stores/modalStore';
import { Wallet as WalletIcon } from 'lucide-react';
import useWindowSize from '@/lib/hooks/useWindowSize';
import Image from 'next/image';
type CryptoNetworks = 'ETH' | 'TRC-20' | 'TON';
type CryptoCoins = 'TON' | 'USDT' | 'ETH';

interface CryptoPaymentPopupProps {
  address: string;
  amount: number;
  onPay: (network: CryptoNetworks, coin: CryptoCoins) => void;
  onClose?: () => void;
}

const networks = [{ name: 'TON', coins: ['USDT', 'TON'] }];

function Stepper({ currentStep }: { currentStep: number }) {
  const steps = ['Сеть', 'Монета', 'Оплата'];
  return (
    <div className="flex items-baseline justify-between mb-6">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded border-2
                ${
                  currentStep === idx + 1
                    ? 'border-green-500 bg-green-500 text-white'
                    : currentStep > idx + 1
                      ? 'border-green-400 bg-green-400 text-white'
                      : 'border-zinc-600 bg-zinc-800 text-zinc-400'
                }
              `}
            >
              {idx + 1}
            </div>
            <span
              className={`mt-1 text-xs ${
                currentStep === idx + 1 ? 'text-green-400' : 'text-zinc-400'
              }`}
            >
              {step}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={
                currentStep > idx + 1
                  ? 'w-8 h-1 mx-2 rounded bg-green-800'
                  : 'w-8 h-1 mx-2 rounded bg-zinc-400'
              }
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function CryptoPaymentPopup({
  address,
  amount,
  onPay,
  onClose,
}: CryptoPaymentPopupProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetworks | null>(
    null
  );
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoins | null>(null);

  const availableCoins = selectedNetwork
    ? networks.find((n) => n.name === selectedNetwork)?.coins || []
    : [];




  return (
    <div className="inset-0 bg-transparent bg-opacity-60 flex justify-center z-50 min-w-[320px]">
      <div className="bg-transparent rounded-xl p-2  w-full max-w-md  relative">
        <h3>Payment with crypto</h3>
        <p className={'mb-1 text-gray-300'}>
          address: {address.slice(0, 6)}...
          {address.slice(-4)}
        </p>
        <p className={'mb-6 text-gray-300 '}>amount: {amount} $</p>
        <Stepper currentStep={!selectedNetwork ? 1 : !selectedCoin ? 2 : 3} />
        <h2 className="text-2xl font-bold text-white mb-2">
          Оплата криптовалютой
        </h2>
        <p className="text-zinc-400 text-sm mb-6">
          Выберите сеть, затем монету для оплаты.
        </p>

        {/* Шаг 1: Выбор сети */}
        {!selectedNetwork && (
          <div className="flex flex-col gap-2 animate-fade-in">
            <div className="flex flex-col gap-4 justify-center">
              {networks.map((network) => (
                <button
                  key={network.name}
                  onClick={() => {
                    setSelectedNetwork(network.name as CryptoNetworks);
                    setSelectedCoin(null);
                  }}
                  className={`flex justify-center gap-4 items-center px-4 py-3 rounded-lg border-2 transition-all
                    ${
                      selectedNetwork === network.name
                        ? 'border-green-500 bg-zinc-700'
                        : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700'
                    }
                  `}
                >
                  <img
                    src={`/${network.name.toLowerCase()}.svg`}
                    alt={network.name}
                    className="w-8 h-8 mb-1"
                  />
                  <span className="text-white">{network.name}</span>
                </button>
              ))}
            </div>
            <button
              className="mt-6 text-zinc-400 underline hover:text-white"
              onClick={onClose}
            >
              Отмена
            </button>
          </div>
        )}

        {/* Шаг 2: Выбор монеты */}
        {selectedNetwork && !selectedCoin && (
          <div className="flex flex-col gap-2 animate-fade-in">
            {/*<h3 className="text-white mb-2 text-left">Выберите монету</h3>*/}
            <div className="flex flex-col gap-4 justify-center">
              {availableCoins.map((coin) => (
                <button
                  key={coin}
                  onClick={() => setSelectedCoin(coin as CryptoCoins)}
                  className={`flex flex-col items-center px-4 py-3 rounded-lg border-2 transition-all
                    ${
                      selectedCoin === coin
                        ? 'border-green-500 bg-zinc-700'
                        : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700'
                    }
                  `}
                >
                  <img
                    src={`/${coin.toLowerCase()}.svg`}
                    alt={coin}
                    className="w-8 h-8 mb-1"
                  />
                  <span className="text-white">{coin}</span>
                </button>
              ))}
            </div>
            <button
              className="mt-6 text-zinc-400 underline hover:text-white"
              onClick={() => setSelectedNetwork(null)}
            >
              Назад
            </button>
          </div>
        )}

        {/* Шаг 3: Кнопка оплаты */}
        {selectedNetwork && selectedCoin && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="flex gap-2 items-center mb-4">
              <img
                src={`/${selectedNetwork.toLowerCase()}.svg`}
                alt={selectedNetwork}
                className="w-7 h-7"
              />
              <span className="text-white font-semibold">
                {selectedNetwork}
              </span>
              <span className="text-zinc-400">/</span>
              <img
                src={`/${selectedCoin.toLowerCase()}.svg`}
                alt={selectedCoin}
                className="w-7 h-7"
              />
              <span className="text-white font-semibold">{selectedCoin}</span>
            </div>
            <button
              onClick={() =>
                onPay(
                  selectedNetwork as CryptoNetworks,
                  selectedCoin as CryptoCoins
                )
              }
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-bold text-lg"
            >
              Оплатить
            </button>
            <button
              className="mt-4 text-zinc-400 underline hover:text-white"
              onClick={() => setSelectedCoin(null)}
            >
              Назад
            </button>
          </div>
        )}
      </div>
      {/* Анимация fade-in (TailwindCSS custom) */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
interface WalletConnectProps {
  isCanPay: boolean;
  amount: number;
}
export default function WalletConnect({
  isCanPay = false,
  amount,
}: WalletConnectProps) {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const userAddress = useTonAddress();
  const { isMobile } = useWindowSize();
  const [comment, setComment] = useState('');
  const { openModal, isOpen } = useModalStore((state) => state);

  const handleConnect = async () => {
    try {
      await tonConnectUI.openModal();
      ('Кошелёк подключён');
    } catch (error) {
      console.error('Ошибка подключения кошелька:', error);
    }
  };

  const fetchBalance = async () => {
    if (userAddress) {
      const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      });
      const address = Address.parse(userAddress);
      const balance = await client.getBalance(address);
      (`Баланс: ${balance.toString()} TON`);
      alert(`Ваш баланс: ${balance.toString()} TON`);
    }
  };

  const sendPayment = async () => {
    if (!userAddress) {
      alert('Подключите кошелёк!');
      return;
    }

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // Время действия транзакции (60 секунд)
        messages: [
          {
            address: 'UQCmSBU0CDxcbRS1PptgoucNbAGFvOP3T7G7xESvURiTbFlW',
            amount: toNano(1).toString(),
            payload: comment
              ? Buffer.from(comment).toString('base64')
              : undefined,
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      ('Транзакция отправлена:', result);
      alert('Платёж успешно отправлен!');
    } catch (error) {
      console.error('Ошибка отправки платежа:', error);
      alert('Ошибка при отправке платежа: ' + error.message);
    }
  };
  const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  });
  const getJettonAddress = async (senderAddress: string) => {
    const jettonMaster = Address.parse(
      'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'
    );
    const ownerAddress = Address.parseFriendly(senderAddress).address;
    const contract = client.open(JettonMaster.create(jettonMaster));
    const jettonWallet = await contract.getWalletAddress(ownerAddress);

    return jettonWallet;
  };
  const sendUsdtTransfer = async () => {
    try {
      const decimals = 6;
      const amount = 1;
      const nanoAmount = BigInt(Math.floor(amount * 10 ** decimals));

      const toAddress = Address.parse(
        process.env.NEXT_PUBLIC_TON_RECIPIENT_ADDRESS!
      );
      const responseAddress = Address.parse(userAddress);
      const jettonAddress = await getJettonAddress(userAddress);

      const jettonTransferPayload = beginCell()
        .storeUint(0xf8a7ea5, 32) // transfer op code
        .storeUint(0, 64) // query_id
        .storeCoins(nanoAmount) // amount
        .storeAddress(toAddress) // to address (Jetton Wallet)
        .storeAddress(responseAddress) // response_destination
        .storeBit(0) // custom_payload (none)
        .storeCoins(0) // forward_ton_amount
        .storeBit(0) // forward_payload (none)
        .endCell()
        .toBoc()
        .toString('base64');

      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: jettonAddress.toString(),
            amount: '50000000',
            payload: jettonTransferPayload,
          },
        ],
      });

      ('Transaction successful:', result);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };
  const openCryptoFlowPopup = () => {
    openModal({
      type: 'message',
      content: (
        <CryptoPaymentPopup
          amount={amount}
          onPay={sendUsdtTransfer}
          address={userAddress}
        />
      ),
    });
  };
  const getStateStyles = () => {
    if (isOpen) {
      return {
        container: 'bg-zinc-800 border-green-500',
        icon: 'text-green-500',
        text: 'text-white',
        button: 'bg-green-500 hover:bg-green-600',
      };
    }
    if (userAddress) {
      return {
        container: 'bg-zinc-800 border-pink-500',
        icon: 'text-pink-500',
        text: 'text-white',
        button: 'bg-green-500 hover:bg-green-600',
      };
    } else {
      return {
        container: 'bg-zinc-800 border-zinc-700',
        icon: 'text-zinc-400',
        text: 'text-zinc-400',
        button: 'bg-pink-500 hover:bg-pink-600',
      };
    }
  };
  const styles = getStateStyles();
  if (isCanPay && !userAddress) {
    return (
      <button
        onClick={handleConnect}
        className="bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 flex w-full justify-center items-center gap-2"
      >
        <Image
          src={'/ton.svg'}
          alt={'ton icon'}
          className="w-8 h-8 "
          width={8}
          height={8}
        />
        Connect Wallet
      </button>
    );
  }
  if (userAddress && isCanPay && !isOpen) {
    return (
      <button
        onClick={openCryptoFlowPopup}
        className="bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 flex w-full justify-center items-center gap-2"
      >
        {' '}
        <Image
          src={'/ton.svg'}
          alt={'ton icon'}
          className="w-8 h-8"
          width={8}
          height={8}
        />
        Pay with{' '}
        {userAddress.slice(0, 6) +
          '...' +
          userAddress.slice(userAddress.length - 6, userAddress.length)}
      </button>
    );
  }
  return (
    <div
      className={`p-4 rounded-lg  ${styles?.container} w-full transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-zinc-900 ${styles?.icon}`}>
            <WalletIcon size={24} />
          </div>

          <div>
            <h3 className="text-white font-medium">Wallet</h3>
            {!userAddress ? (
              <p className={`text-sm ${styles?.text}`}>Not connected</p>
            ) : (
              <p className={`text-sm ${styles?.text} font-mono`}>
                {isMobile
                  ? userAddress.slice(0, 6) +
                    '...' +
                    userAddress.slice(
                      userAddress.length - 6,
                      userAddress.length
                    )
                  : userAddress}
              </p>
            )}
          </div>
        </div>

        {!userAddress && !isCanPay && (
          <button
            onClick={handleConnect}
            className="text-xs bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold py-2 px-3 rounded transition duration-200 flex justify-center items-center gap-1"
          >
            <Image
              src={'/ton.svg'}
              alt={'ton icon'}
              className="w-5 h-5 "
              width={5}
              height={5}
            />
            Connect
          </button>
        )}
        {userAddress && !isCanPay && (
          <p className={'text-zinc-400'}>Connected</p>
        )}

        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-green-500">Processing</span>
          </div>
        )}
      </div>
    </div>
  );
}
