const couchbase = require("couchbase");
const ibmdb = require("ibm_db");
const SftpClient = require("ssh2-sftp-client");

async function sftp() {
  const client = new SftpClient("upload-test");
  const dst = "tmp/diariosimsSIM.txt";
  const src = "nirm-dumps/diariosimsSIM.txt";

  try {
    await client.connect({
      host: "172.22.116.109",
      port: 22,
      user: "is4tech",
      password: "Tigo2022",
    });
    client.on("download", (info) => {
      console.log(`Listener: Download ${info.source}`);
    });
    let rslt = await client.get(src, dst);
    return rslt;
  } finally {
    client.end();
  }
}

async function couch() {
  const bucket = await couchbase.connect("couchbase://172.22.191.103:8091", {
    username: "jraguilar",
    password: "Tigo2021",
  });
  bucket.bucket("NIRM_QA");

  //try {
    // const n1ql =
    //   "SELECT numberData, platform, product, * FROM `NIRM_QA` WHERE _type='com.is4tech.tigo.nirm.service.domain.Numeration' AND creationDate= 1657299032223";
    // const query = bucket.N1qlQuery.fromString(n1ql);
    // bucket.query(query, (err, result) => {
    //   if (err) {
    //     console.log(err, "here");
    //   } else {
    //     console.log(result);
    //   }
    // });
  // } catch (error) {
  //   console.log(error);
  // }
}

async function ibm() {
  ibmdb.open(
    "DATABASE=QSTCDAT;HOSTNAME=130.1.1.166;PORT=80;PROTOCOL=TCPIP;UID=MESOSDIG;PWD=M3S0SAPPGT;",
    function (err, connection) {
      if (err) {
        console.log(err);
        return;
      }
      connection.query(
        "SELECT DOCTO.CCTIPD TIPO_DOCTO, DOCTO.CCLDOC LETRA_DOCTO, DOCTO.CCNDOC NUMERO_DOCTO, DOCTO.CCVDOC VALOR_DOCTO, DOCTO.CCSALT SALDO, DOCTO.TCNFOL ANEXO, DOCTO.CCNTEL TELEFONO, DOCTO.CCCABO CARGO_ABONO, DOCTO.CCDIDO || '/' || DOCTO.CCMEDO || '/' || DOCTO.CCA##SCAPE##DO FECHA_EMISION, DOCTO.CCSTAD ESTADO, DOCTO.CCDIVE || '/' || DOCTO.CCMEVE || '/' || DOCTO.CCA##SCAPE##VE FECHA_VENCIMIENTO, DOCTO.CCCMOT MOTIVO from qstcdat.C1DOCT18 docto WHERE CCINHI <> 'S' AND TCNFOL = ? AND TO_DATE(ccdido || '/' || ccmedo || '/' || CCA##SCAPE##DO, 'DD/MM/YYYY') BETWEEN ? AND ? AND ((? = 0 AND CCCABO = 'C' AND CCSALT != 0) OR (? = 1 AND CCCABO = 'C' AND CCSALT = 0) OR (? = 2 AND CCCABO = 'C') OR (? = 0 AND CCCABO = 'A' AND CCSALT != 0) OR (? = 1 AND CCCABO = 'A' AND CCSALT = 0) OR (? = 2 AND CCCABO = 'A'))",
        function (err1, rows) {
          if (err1) console.log(err1);
          else console.log(rows);
          connection.close(function (err2) {
            if (err2) console.log(err2);
          });
        }
      );
    }
  );
}

// sftp()
//   .then((msg) => {
//     console.log(msg);
//   })
//   .catch((err) => {
//     console.log(`main error: ${err.message}`);
//   });

couch();