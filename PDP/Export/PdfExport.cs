using PdfFileWriter;
using System;
using System.IO;
using System.Linq;

namespace PDP.Export
{
    public class PdfExport
    {
        public PdfDocument PdfDocument { get; set; }
        public PdfPage PdfPage { get; set; }
        public PdfContents PdfContents { get; set; }
        public MemoryStream PdfStream { get; set; }

        public PdfExport()
        {
            PdfStream = new MemoryStream();

            PdfDocument = new PdfDocument(PaperType.A4, false, UnitOfMeasure.Inch, PdfStream);
            PdfPage = new PdfPage(PdfDocument);

            PdfContents = new PdfContents(PdfPage);
        }

        public byte[] Create()
        {
            double fontSize = 12;
            double height = 11.69;
            double width = 8.27;

            PdfDocument.CreateFile();

            return PdfStream.ToArray();
        }
    }
}
