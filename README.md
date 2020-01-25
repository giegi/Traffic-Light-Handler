<h2>Traffic Light Handler - TLH</h2><br />

You might never need this tool in your whole programmer life. Most of the web developers won't have the need to use a queue/library download manager to handle which library to load first, and which libraries need to be waited before downloading another one. Many developers won't need to wait data from three, four, five other javascript sources.<br />
But if you might need to do this, tlh is right for you.<br />
TLH is a js/css library download handler for complex javascript ecosystems. </p>
<p>Let's draw a scenario.<br />
An analytics system, in order to work properly, needs to have available a serie of objects and informations in page. These objects have different sources. A javascript library, the result of an asynchronous ajax call, the acceptance of the Gdpr Infoprivacy, the analytics sdk, its initialization, an execution of a script<br />
Putting in order the script tags in the head tag is not enough to be sure that everything will work in the correct sequence.
TLH does this for you. <br />
Let's see a pratical example.</p>
<p>We have four libraries, A, B, C, D
We have three scripts, Z, W and X
A can be downloaded to initiate the chain (or A must wait the DomContentLoaded to be downloaded)
Z needs A to be downloaded.
B to be downloaded needs: Z to be executed and A to be downloaded
C to be downloaded needs: B to be downloaded and executed
X to be executed needs C to be downloaded and executed
D needs everything before downloaded and executed to be downloaded.
At the end of the execution of D, script W can be executed
<p>
  <ol>
    <li> We create A TLH object. </li>
    <li> We create a Z TLH Object. We set A as dependency of Z</li>
    <li> We create B TLH object. We set object A to be a library dependency of B. We set object Z to be a dependency of B</li>
    <li> We create a C TLH Object. We set B as a dependency of C. Do not need to specify dependency from A and Z because already satisfied from the previous dependencies of B.</li>
    <li> We create a X TLH Object. We set C as dependency of X.</li>
    <li> We create a D TLH Object. We set X as dependency of D. No need to specify any other dependency as previous dependencies satisfy the needs.</li>
  </ol>
  In a so made scenario, Trafic Light Handler allows you to set complex hierarchies of objects. 
  Every TLH object can be a library to download, a script to execute, an empty container, or both the firsts.
  For every TLH Object a couple of things can be set:
  <ul>
    <li> its core: a library to download or a script to execute</li>
    <li> a callback function when library has been successfully downloaded (or script properly executed)</li>
    <li> a callback function when library download or script execution caused an error</li>
    <li> a callback function when the object is complete (lib downloaded or script executed, no other dependencies still active)</li>
  </ul>

  To every TLH Object can be assigned two kinds of dependencies:
  <ul>
    <li> a dependency that blocks execution of the core (lib or script) _> core dependency</li>
    <li> a dependency that blocks the state of the object (completed or not) after the core execution _> object dependency</li>
  </ul>
  Both kind of dependencies can be set at the same time.

  As a dependency, there are many object can be assigned: 
  <ul>
    <li>another TLH Object (resolves when it completes its state)</li>
    <li>a condition to test</li>
    <li>an empty dependency that has a label and must be resolved manually with a line of code</li>
  </ul>
When created, an object doesn't do anything. It must be executed manually or be activated from one of its dependencies that change its own state and communicates this to its dependencies. 
When executed or activated, every tlh object analyzes its core dependencies and, if all of them are satisfied, it can download library or execute  core script, and then, after verifying the object dependencies, completes the state and executes final callback. 
If one of the dependencies isn't satisfied, the object waits until it is.
</p>
<p style="display:none;">
SETUP CONFIGS<br/>
kw_tlh_configs.adsetup = tlhControlObject(null, undefined, null, null, null);<br/>
kw_tlh_configs.nielsenStatic = tlhControlObject(null, "https://www.example.it/nielsen/nielsen_static.js", null, null, true);<br/>
kw_tlh_configs.chartbeat = tlhControlObject(function() { window.loadChartbeat(); }, "https://www.example.it/chartbeat/chartbeat.js", null, null, true);<br/>
kw_tlh_configs.webtrekk_mapping = tlhControlObject(null, "https://www.example.it/wt/wt_mapping_script.js?pageurl=blablablacurrentpage", null, null, true);<br/>
kw_tlh_configs.webtrekk = tlhControlObject(window.kw_webtrekk_complete, "https://www.exampe.it//config_webtrekk.php", window.kw_run_webtrekk, null, true);<br/>   
<br />
SETUP OBJECTS ANBD DEPENDENCIES<br/>
window.kw_tlh.adsetup = new tlhl("adsetup", kw_tlh_configs.adsetup);<br/>
window.kw_tlh.adsetup.addRedLight("adsetupreal");<br/>
window.kw_tlh.adsetup.addRedLight("infoprivacy", function() { return window.kwdnt !== undefined; });<br/>
window.kw_tlh.nielsenStatic = new tlhl("nielsenStatic", kw_tlh_configs.nielsenStatic);<br/>
window.kw_tlh.nielsenStatic.execute();<br/>
window.kw_tlh.webtrekk_mapping = new tlhl("webtrekk_mapping", kw_tlh_configs.webtrekk_mapping);<br/>
window.kw_tlh.webtrekk_mapping.addLibRedLight("adsetup", window.kw_tlh.adsetup);<br/>
window.kw_tlh.webtrekk = new tlhl("webtrekk", kw_tlh_configs.webtrekk);		<br/>
window.kw_tlh.webtrekk.addLibRedLight("webtrekk_mapping", window.kw_tlh.webtrekk_mapping);<br/>
window.kw_tlh.webtrekk.addLibRedLight("adsetup", window.kw_tlh.adsetup);    <br/>
window.kw_tlh.webtrekk.addRedLight("wt_init");<br/>
window.kw_tlh.webtrekk.addRedLight("wt_send");<br/>
window.kw_tlh.chartbeat = new tlhl("chartbeat", kw_tlh_configs.chartbeat);<br/>
window.kw_tlh.chartbeat.addLibRedLight("webtrekk_mapping", window.kw_tlh.webtrekk_mapping);<br/>
</p>
