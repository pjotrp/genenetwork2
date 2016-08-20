# Biodalliance in GN2

As a Google Summer of Code project Christian Fisher has added tracks
for genetics to the
[Biodalliance genome browser](http://www.biodalliance.org/) and the
browser has been included in GN2.

At the moment the genome browser is a little hard to find - it is part
of the Vector Map QTL view, behind the chromosome.

To test the browser go to GN2, for example visit http://test-gn2.genenetwork.org/show_trait?trait_id=1433387_at&dataset=HC_M2_0606_P.

Hit one of the mapping options (e.g. pylmm -> compute) and when in the
QTL view click on the 'Vector Map' tab (note it may take 10s to render).

In this QTL map, click on a chromosome panel. This will zoom in on the
chromosome.

Next click on 'Open BioDalliance View' and you should see the genome
browser with panels for genotype, QTL and SNP density.

## Moving around and zoom

Drag tracks with the mouse. You can click on the zoom buttons too.

## QTL track

The QTL track should fit the panel. But it displays fine.

## Genotype track

The genotype track looks a bit odd now - this is probably due to not
all markers being position sorted in the raw genotype file. We are
fixing this. Click on the genotype track and you'll see mouse and
marker in a pop-up.

## SNP density track

The 'bins' are a bit large now to speed up drawing. We'll make
them zoomable too.

## Adding more tracks

One of the great features of Biodalliance is that it comes with
downloadable and remote extra tracks.

Currently you have to add tracks 'by hand'. We'll add buttons for this
in the near future. To add tracks you can paste a URL into the '+' button.
The datasets are listed in http://www.biodalliance.org/datasets/ and for
mouse some http://www.biodalliance.org/datasets/GRCm38/.

Try the following for now:

### Gene track

Add the mouse gene track by clicking on the '+' button and pasting in

    http://www.biodalliance.org/datasets/GRCm38/gencodeM2.bb

into the 'Binary' tab with 'URL' field. Click on 'Add' twice and you
have a gene track! By zooming in you can see individual genes and
exon/intron information.

## Repeats track

Use the '+' button and 'Binary' tab again and paste

    http://www.biodalliance.org/datasets/GRCm38/repeats.bb

## Human mapping to mouse track

    http://www.biodalliance.org/datasets/mm10ToHg19.bb

## Other tracks (human, C. elegans)

In http://www.biodalliance.org/datasets/ you'll find a host of
other tracks, most for human, including encode
