//+------------------------------------------------------------------+
//|                                                 NICS-Journal.mq5 |
//|                 NICS Trading Ecosystem - personal trade journal  |
//|                                         by AI Byte Consult Ltd   |
//+------------------------------------------------------------------+
//| Sends every closed position of this account to your NICS trade   |
//| journal (Windows app, web cabinet, Telegram Mini App).            |
//| The expert does NOT trade and does NOT change any orders.        |
//|                                                                  |
//| Setup:                                                           |
//| 1. Tools -> Options -> Expert Advisors -> "Allow WebRequest for  |
//|    listed URL" -> add https://n8n.aibyteconsult.com              |
//| 2. Compile (F7), drag "NICS-Journal" onto any one chart.         |
//| 3. Paste the journal key from the app (Trade journal ->          |
//|    Connect MT5) into InpJournalKey.                              |
//+------------------------------------------------------------------+
#property copyright "AI Byte Consult Ltd"
#property link      "https://aibyteconsult.com/trading/"
#property version   "1.00"

input string InpJournalKey   = "";   // Journal key (NJ-...)
input int    InpDaysBack     = 30;   // On first start, send closed trades of the last N days
input int    InpIntervalSec  = 60;   // How often to check for new closed trades, seconds

const string JOURNAL_URL = "https://n8n.aibyteconsult.com/webhook/nics-journal";
const int    BATCH_SIZE  = 50;

string g_lastVar;

//+------------------------------------------------------------------+
int OnInit()
  {
   if(StringLen(InpJournalKey) < 10)
     {
      Print("NICS Journal: paste your journal key into InpJournalKey (app -> Trade journal -> Connect MT5).");
      return(INIT_PARAMETERS_INCORRECT);
     }
   g_lastVar = "NICSJ_" + IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN)) + "_last";
   EventSetTimer(MathMax(15, InpIntervalSec));
   SendClosedTrades();
   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
  {
   EventKillTimer();
  }

//+------------------------------------------------------------------+
void OnTimer()
  {
   SendClosedTrades();
  }

//+------------------------------------------------------------------+
//| Also react right away when a position is closed                  |
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction &trans,
                        const MqlTradeRequest &request,
                        const MqlTradeResult &result)
  {
   if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
      SendClosedTrades();
  }

//+------------------------------------------------------------------+
string JsonEscape(string text)
  {
   StringReplace(text, "\\", "\\\\");
   StringReplace(text, "\"", "\\\"");
   return(text);
  }

//+------------------------------------------------------------------+
string Num(double value, int digits)
  {
   return(DoubleToString(value, digits));
  }

//+------------------------------------------------------------------+
bool PostBatch(string tradesJson)
  {
   string body = "{\"action\":\"ea_push\",\"journalKey\":\"" + JsonEscape(InpJournalKey) + "\",\"trades\":[" + tradesJson + "]}";
   char data[];
   char answer[];
   string answerHeaders;
   int length = StringToCharArray(body, data, 0, WHOLE_ARRAY, CP_UTF8);
   if(length > 0)
      ArrayResize(data, length - 1);   // drop the terminating zero
   ResetLastError();
   int status = WebRequest("POST", JOURNAL_URL, "Content-Type: text/plain\r\n", 15000, data, answer, answerHeaders);
   if(status == -1)
     {
      int error = GetLastError();
      if(error == 4014)
         Print("NICS Journal: allow WebRequest for https://n8n.aibyteconsult.com in Tools -> Options -> Expert Advisors.");
      else
         Print("NICS Journal: network error ", error, ", will retry.");
      return(false);
     }
   if(status != 200)
     {
      Print("NICS Journal: server answered ", status, ": ", CharArrayToString(answer, 0, WHOLE_ARRAY, CP_UTF8));
      return(false);
     }
   return(true);
  }

//+------------------------------------------------------------------+
//| Collect closing deals newer than the last sent one and post them |
//+------------------------------------------------------------------+
void SendClosedTrades()
  {
   datetime now = TimeCurrent();
   datetime last = 0;
   if(GlobalVariableCheck(g_lastVar))
      last = (datetime)GlobalVariableGet(g_lastVar);
   else
      last = now - InpDaysBack * 86400;

   // Look further back so the opening deals of these positions are in the selection too.
   if(!HistorySelect(last - 30 * 86400, now + 86400))
      return;

   int total = HistoryDealsTotal();
   string account = IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN));
   string currency = AccountInfoString(ACCOUNT_CURRENCY);
   string batch = "";
   int inBatch = 0;
   datetime newest = last;

   for(int i = 0; i < total; i++)
     {
      ulong deal = HistoryDealGetTicket(i);
      if(deal == 0)
         continue;
      long entry = HistoryDealGetInteger(deal, DEAL_ENTRY);
      if(entry != DEAL_ENTRY_OUT && entry != DEAL_ENTRY_OUT_BY && entry != DEAL_ENTRY_INOUT)
         continue;
      long dealType = HistoryDealGetInteger(deal, DEAL_TYPE);
      if(dealType != DEAL_TYPE_BUY && dealType != DEAL_TYPE_SELL)
         continue;
      datetime closeTime = (datetime)HistoryDealGetInteger(deal, DEAL_TIME);
      if(closeTime <= last)
         continue;

      long positionId = HistoryDealGetInteger(deal, DEAL_POSITION_ID);
      string symbol = HistoryDealGetString(deal, DEAL_SYMBOL);
      int digits = (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS);
      if(digits <= 0)
         digits = 5;

      // Closing a BUY is a SELL deal and the other way round.
      string side = (dealType == DEAL_TYPE_SELL) ? "BUY" : "SELL";
      datetime openTime = 0;
      double openPrice = 0, stopLoss = 0, takeProfit = 0, openCommission = 0;

      // Find the opening deal of the same position.
      for(int j = 0; j < total; j++)
        {
         ulong inDeal = HistoryDealGetTicket(j);
         if(inDeal == 0 || HistoryDealGetInteger(inDeal, DEAL_POSITION_ID) != positionId)
            continue;
         if(HistoryDealGetInteger(inDeal, DEAL_ENTRY) != DEAL_ENTRY_IN)
            continue;
         openTime = (datetime)HistoryDealGetInteger(inDeal, DEAL_TIME);
         openPrice = HistoryDealGetDouble(inDeal, DEAL_PRICE);
         stopLoss = HistoryDealGetDouble(inDeal, DEAL_SL);
         takeProfit = HistoryDealGetDouble(inDeal, DEAL_TP);
         openCommission = HistoryDealGetDouble(inDeal, DEAL_COMMISSION);
         side = (HistoryDealGetInteger(inDeal, DEAL_TYPE) == DEAL_TYPE_BUY) ? "BUY" : "SELL";
         break;
        }
      if(stopLoss == 0)
         stopLoss = HistoryDealGetDouble(deal, DEAL_SL);
      if(takeProfit == 0)
         takeProfit = HistoryDealGetDouble(deal, DEAL_TP);

      double commission = HistoryDealGetDouble(deal, DEAL_COMMISSION) + openCommission + HistoryDealGetDouble(deal, DEAL_FEE);
      string item = "{";
      item += "\"externalId\":\"" + IntegerToString((long)deal) + "\",";
      item += "\"account\":\"" + account + "\",";
      item += "\"symbol\":\"" + JsonEscape(symbol) + "\",";
      item += "\"side\":\"" + side + "\",";
      item += "\"volume\":" + Num(HistoryDealGetDouble(deal, DEAL_VOLUME), 2) + ",";
      if(openTime > 0)
         item += "\"openTime\":\"" + TimeToString(openTime, TIME_DATE | TIME_SECONDS) + "\",";
      item += "\"closeTime\":\"" + TimeToString(closeTime, TIME_DATE | TIME_SECONDS) + "\",";
      if(openPrice > 0)
         item += "\"openPrice\":" + Num(openPrice, digits) + ",";
      item += "\"closePrice\":" + Num(HistoryDealGetDouble(deal, DEAL_PRICE), digits) + ",";
      if(stopLoss > 0)
         item += "\"stopLoss\":" + Num(stopLoss, digits) + ",";
      if(takeProfit > 0)
         item += "\"takeProfit\":" + Num(takeProfit, digits) + ",";
      item += "\"profit\":" + Num(HistoryDealGetDouble(deal, DEAL_PROFIT), 2) + ",";
      item += "\"commission\":" + Num(commission, 2) + ",";
      item += "\"swap\":" + Num(HistoryDealGetDouble(deal, DEAL_SWAP), 2) + ",";
      item += "\"currency\":\"" + currency + "\"";
      item += "}";

      batch += (inBatch > 0 ? "," : "") + item;
      inBatch++;
      if(closeTime > newest)
         newest = closeTime;

      if(inBatch >= BATCH_SIZE)
        {
         if(!PostBatch(batch))
            return;
         GlobalVariableSet(g_lastVar, (double)newest);
         batch = "";
         inBatch = 0;
        }
     }

   if(inBatch > 0)
     {
      if(!PostBatch(batch))
         return;
      Print("NICS Journal: sent ", inBatch, " closed trade(s).");
     }
   // Remember where we stopped. Sending the same trade twice is harmless:
   // the journal keeps one row per deal.
   GlobalVariableSet(g_lastVar, (double)MathMax(newest, last));
  }
//+------------------------------------------------------------------+
