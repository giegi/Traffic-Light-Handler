<h2>Traffic Light Handler - TLH</h2><br />

You might never need this tool in your whole programmer life. Most of the web developers won't have the need to use a library download manager to handle which library to load first, and which libraries need to be waited before downloading another one. Many developers won't need to wait data from three, four, five other javascript sources.<br />
But if you might need to do this, tlh is right for you.<br />
TLH is a js/css library download handler for complex javascript ecosystems. </p>
<p>Let's draw a scenario.<br />
An analytics system, in order to work properly, needs to have available a serie of objects and informations in page. These objects have different sources. A javascript library, the result of an asynchronous ajax call, the acceptance of the Gdpr Infoprivacy, the analytics sdk, its initialization.<br />
Putting in order the script tags in the head tag is not enough to be sure that everything will work in the correct sequence.
TLH does this for you. <br />
Let's see a pratical example.</p>
