using AutoMapper;
using Erdcsharp.Configuration;
using Erdcsharp.Domain;
using Erdcsharp.Provider;
using HtmlToPDFCore;
using M0LTE.AdifLib;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Numerics;
using System.Runtime.InteropServices;
using static System.Formats.Asn1.AsnWriter;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;
using System.Net.Http.Headers;
using HamEvent.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Runtime.CompilerServices;
using HamEvent.Data.Model;
using System.Text.Json;

namespace HamEvent.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HamEventController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly HamEventContext _dbcontext;
        private readonly ILogger<HamEventController> _logger;

        public HamEventController(ILogger<HamEventController> logger ,IMapper mapper, HamEventContext dbcontext)
        {
            _logger = logger;
            _mapper = mapper;
            _dbcontext = dbcontext;
        }


        [HttpGet("{hamevent}")]
        public IEnumerable<QSO> Get(Guid hamevent,string callsign="")
        {
            try
            {
                if (!String.IsNullOrEmpty(callsign))
                {
                    return _dbcontext.QSOs.Where(qso=>qso.EventId.Equals(hamevent)).Where(qso => string.Equals(callsign.ToLower(), qso.Callsign2.ToLower())).ToList();
                }
                return _dbcontext.QSOs.Where(qso => qso.EventId.Equals(hamevent)).ToList();
            }
            catch (Exception ex) {
                return new List<QSO>();
            }
        }

        [HttpGet("hamevents")]
        public IEnumerable<Event> Get()
        {
            try
            {

                return _dbcontext.Events.ToList();
            }
            catch (Exception ex)
            {
                return new List<Event>();
            }
        }
        [HttpGet("Diploma/{hamevent}/{callsign}")]
        public IActionResult PDF(Guid hamevent, string callsign)
        {
            try

            {
                string url = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}/static/diploma.html";

                using (HttpClient client = new HttpClient())
                {
                    using (HttpResponseMessage response = client.GetAsync(url).Result)
                    {
                        using (HttpContent content = response.Content)
                        {
                            string html = content.ReadAsStringAsync().Result;
                            var pdf = new HtmlToPDF();
                            var buffer = pdf.ReturnPDF(html);
                            var stream = new MemoryStream(buffer);
                            return new FileStreamResult(stream, "application/pdf");
                        }
                    }
                }
              
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        [HttpPost("{hamevent}/{eventsecret}/upload")]
        public IActionResult Upload(Guid hamevent, Guid eventsecret)
        {
            try
            {
                var myevent=_dbcontext.Events.Where(e => e.Id.Equals(hamevent) && e.SecretKey.Equals(eventsecret)).FirstOrDefault();

                    var adifInport = Request.Form.Files[0];
                    if (adifInport.Length > 0 && myevent != null)
                    {
                        using (var reader = new StreamReader(adifInport.OpenReadStream()))
                        {
                            var adif = reader.ReadToEnd();
                            AdifFile.TryParse(adif, out var file);
                            List<AdifContactRecord> adifQSOs = file.Records.ToList();
                            List<QSO> QSOs = _mapper.Map<List<AdifContactRecord>, List<QSO>>(adifQSOs);
                            foreach (QSO myQSO in QSOs)
                            {
                                myQSO.EventId = hamevent;
                                _dbcontext.QSOs.Add(myQSO);
                                AddToMultiversx(myQSO);
                            }
                            _dbcontext.SaveChanges();
                        }

                        return Ok();
                    }
                    else
                    {
                        return BadRequest();
                    }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        public async void AddToMultiversx(QSO qso) {
            var provider = new ElrondProvider(new HttpClient(), new ElrondNetworkConfiguration(Network.DevNet));
            //var account = await provider.GetAccount("erd1s5fh0dcpmvhs4vwunnzyvwwgjxc0pzx396pguxa2lc4k870ws3vqkkjx5p");
            var wallet = Wallet.DeriveFromMnemonic("focus round resemble boring ball stay tilt task valley vocal scare taxi supply hint invest mixed luggage mix mammal please velvet stick clarify wrong");

            var sender = wallet.GetAccount();
            var receiver = wallet.GetAccount().Address;
            await sender.Sync(provider);

            var transaction = TransactionRequest.Create(sender, await NetworkConfig.GetFromNetwork(provider), receiver, TokenAmount.EGLD("0"));//TokenAmount.EGLD("0.000000000000000001"));
            transaction.SetData("{" +
                "\"Callsign1\":\""+qso.Callsign1+ "\"," +
                "\"Callsign2\":\""+qso.Callsign2+"\"," +
                "\"Mode\":\"" + qso.Mode + "\"," +
                "\"Band\":\"" + qso.Band + "\"," +
                "\"Timestamp\":\"" + qso.Timestamp + "\"" +
                "}");
            transaction.SetGasLimit(GasLimit.ForTransfer(await NetworkConfig.GetFromNetwork(provider), transaction));
            try
            {
                var transactionResult = await transaction.Send(provider, wallet);
                await transactionResult.AwaitExecuted(provider);

                System.Console.WriteLine("TxHash {0}", transactionResult.TxHash);
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
            }
        }


        [HttpGet("balance")]
        public async Task<IActionResult> GetBalanceAsync()
        {
            var provider = new ElrondProvider(new HttpClient(), new ElrondNetworkConfiguration(Network.DevNet));
            var account = await provider.GetAccount("erd1s5fh0dcpmvhs4vwunnzyvwwgjxc0pzx396pguxa2lc4k870ws3vqkkjx5p");

            System.Console.WriteLine($"Balance : {account.Balance}");

            var amount = TokenAmount.From(account.Balance);
            System.Console.WriteLine($"Balance in EGLD : {amount.ToCurrencyString()}");
            return Ok("{\"balance\":\"" + amount.ToCurrencyString() + "\"}");
        }

        [HttpGet("balanceDoIt")]
        public async Task<IActionResult> BalanceDoIt()
        {
            var provider = new ElrondProvider(new HttpClient(), new ElrondNetworkConfiguration(Network.DevNet));
            //var account = await provider.GetAccount("erd1s5fh0dcpmvhs4vwunnzyvwwgjxc0pzx396pguxa2lc4k870ws3vqkkjx5p");
            var wallet = Wallet.DeriveFromMnemonic("focus round resemble boring ball stay tilt task valley vocal scare taxi supply hint invest mixed luggage mix mammal please velvet stick clarify wrong");

            var sender = wallet.GetAccount();
            var receiver = wallet.GetAccount().Address;
            await sender.Sync(provider);

            var transaction = TransactionRequest.Create(sender, await NetworkConfig.GetFromNetwork(provider), receiver, TokenAmount.EGLD("0"));//TokenAmount.EGLD("0.000000000000000001"));
            transaction.SetData("Hello world !");
            transaction.SetGasLimit(GasLimit.ForTransfer(await NetworkConfig.GetFromNetwork(provider), transaction));
            try
            {
                var transactionResult = await transaction.Send(provider, wallet);
                await transactionResult.AwaitExecuted(provider);

                System.Console.WriteLine("TxHash {0}", transactionResult.TxHash);
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
            }
            return Ok();
        }

    }
}