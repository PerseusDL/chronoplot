# A collection of chart building applications

Built with Javascript. Mostly d3 and jQuery.

# Notes
* Loess Curve
	* http://www.originlab.com/index.aspx?go=Products/Origin/91/LowessLoess

Anno Domini (abbreviated as AD or A.D.) designation used to label or number years used with the Julian and Gregorian calendars. This calendar era is based on the traditionally reckoned year of the conception or birth of Jesus of Nazareth, with AD counting years after the start of this epoch, and BC (Before Christ) denotes years before the start of the epoch. Alternatively, the secular abbreviations CE and BCE are used, respectively.

A.H. means After Hijra (Arabic hijra=migration), this lunar calendar started marking its beggining from the evet of migration of Muhammad, the Prophet of Islam, from Makkah to Madina in 620 AD. But Islamic calendar of Hijra did not begin during the life of the Prophet Muhammad. It actually was introduced by the second Caliph Umar in 637 AD counting back from the year of migration 620 AD.

Hijri - Gregorian

# Convert Gregorian to Hijri Year
G=H-(H/33)+622
H=G-622+(G-622)/32 

# LOESS, LOWESS, Local regression

LOESS = LOWESS
"LOcal regrESSion"
aka Locally weighted scatterplot smoothing

"The subsets of data used for each weighted least squares fit in LOESS are determined by a nearest neighbors algorithm."

polynomial - In mathematics, a polynomial is an expression consisting of variables (or indeterminates) and coefficients, that involves only the operations of addition, subtraction, multiplication, and non-negative integer exponents.

x^n n is the degree.

"LOESS is based on the ideas that any function can be well approximated in a small neighborhood by a low-order polynomial and that simple models can be fit to data easily. High-degree polynomials would tend to overfit the data in each subset and are numerically unstable, making accurate computations difficult."

Weight functions
w(x) = (1-|x|^3)^3I[|x|<1]

# Handy find and replace in Textmate
This fixed the JSON Maxim gave me

,\n}
\n}
[x] Regular Expression

# Dynamic JSON data
Give people something to look at while a large dataset loads.
Load data in chunks.
http://pothibo.com/2013/09/d3-js-how-to-handle-dynamic-json-data/