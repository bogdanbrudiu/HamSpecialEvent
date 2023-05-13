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
        public PageResult<QSO> listQSOs(int? page, int pagesize = 10)
        {
            var countDetails = _dbcontext.QSOs.Count();
            var result = new PageResult<QSO>
            {
                Count = countDetails,
                PageIndex = page ?? 1,
                PageSize = 10,
                Items = _dbcontext.QSOs.Skip((page - 1 ?? 0) * pagesize).Take(pagesize).ToList()
            };
            return result;
        }

        [HttpGet]
        public IEnumerable<QSO> Get(string callsign="")
        {
            //using (StreamReader reader = new StreamReader("QSOs.adi"))
            //{
            //    var adif = reader.ReadToEnd();
            //    AdifFile.TryParse(adif, out var file);
            //    List<AdifContactRecord> adifQSOs = file.Records.ToList();
            //    List<QSO> QSOs = _mapper.Map<List<AdifContactRecord>, List<QSO>>(adifQSOs);
            //    var result = QSOs;
            //    if (!String.IsNullOrEmpty(callsign) && QSOs!=null) {
            //        result = QSOs.Where(qso => string.Equals(callsign, qso.Callsign2, StringComparison.CurrentCultureIgnoreCase)).ToList();
            //    }
            //    return result;
            //}
            try
            {
                if (!String.IsNullOrEmpty(callsign))
                {
                    return _dbcontext.QSOs.Where(qso => string.Equals(callsign.ToLower(), qso.Callsign2.ToLower())).ToList();
                }
                return _dbcontext.QSOs.ToList();
            }
            catch (Exception ex) {
                return new List<QSO>();
            }
        }


        [HttpGet("Diploma/{callsign}")]
        public IActionResult PDF(string callsign)
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

        [HttpPost("upload")]
        public IActionResult Upload()
        {
            try
            {
                var adifInport = Request.Form.Files[0];
                if (adifInport.Length > 0)
                {
                    using (var reader = new StreamReader(adifInport.OpenReadStream()))
                    {
                        var adif = reader.ReadToEnd();
                        AdifFile.TryParse(adif, out var file);
                        List<AdifContactRecord> adifQSOs = file.Records.ToList();
                        List<QSO> QSOs = _mapper.Map<List<AdifContactRecord>, List<QSO>>(adifQSOs);
                        foreach (QSO myQSO in QSOs)
                        {
                            _dbcontext.QSOs.Add(myQSO);
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

            var transaction = TransactionRequest.Create(sender, await NetworkConfig.GetFromNetwork(provider), receiver, TokenAmount.EGLD("0.000000000000000001"));
            transaction.SetData("Hello world !");
            transaction.SetGasLimit(GasLimit.ForTransfer(await NetworkConfig.GetFromNetwork(provider), transaction));
            try
            {
                var transactionResult = await transaction.Send(provider, wallet);
                await transactionResult.AwaitExecuted(provider);

                System.Console.WriteLine("TxHash {0}", transactionResult.TxHash);
            }
            catch (Exception ex) {
                System.Console.WriteLine(ex);
            }
            return Ok();
        }

    }
}