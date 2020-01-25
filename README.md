<h2>Traffic Light Handler - TLH</h2><br />

You might never need this tool in your whole programmer life. Most of the web developers won't have the need to use a queue/library download manager to handle which library to load first, and which libraries need to be waited before downloading another one. Many developers won't need to wait data from three, four, five other javascript sources.<br />
But if you might need to do this, tlh is right for you.<br />
TLH is a js/css library download handler for complex javascript ecosystems. </p>
<p>Let's draw a scenario.<br />
An analytics system, in order to work properly, needs to have available a serie of objects and informations in page. These objects have different sources. A javascript library, the result of an asynchronous ajax call, the acceptance of the Gdpr Infoprivacy, the analytics sdk, its initialization, an execution of a script<br />
Putting in order the script tags in the head tag is not enough to be sure that everything will work in the correct sequence.
TLH does this for you. <br />
Let's see a pratical example.</p>
We have four libraries, A, B, C, D
We have three scripts, Z, W and X
A can be downloaded to initiate the chain (or A must wait the DomContentLoaded to be downloaded)
Z needs A to be downloaded.
B to be downloaded needs: Z to be executed and A to be downloaded
C to be downloaded needs: B to be downloaded and executed
X to be executed needs C to be downloaded and executed
D needs everything before downloaded and executed to be downloaded.
At the end of the execution of D, script W can be executed

1) We create A TLH object. 
2) We create a Z TLH Object. We set A as dependency of Z
3) We create B TLH object. We set object A to be a library dependency of B. We set object Z to be a dependency of B
4) We create a C TLH Object. We set B as a dependency of C. Do not need to specify dependency from A and Z because already satisfied from the previous dependencies of B.
5) We create a X TLH Object. We set C as dependency of X.
6) We create a D TLH Object. We set X as dependency of D. No need to specify any other dependency as previous dependencies satisfy the needs.

In a so made scenario, Trafic Light Handler allows you to set complex hierarchies of objects. 
Every TLH object can be a library to download, a script to execute, an empty container, or both the firsts.
For every TLH Object can be set:
- its core: a library to download or a script to execute
- a callback function when library has been successfully downloaded
- a callback function when library download caused an error
- a callback function when the object is complete (lib downloaded or script executed)
To every TLH Object can be assigned two kinds of dependencies:
- a dependency that blocks execution of the core (lib or script)
- a dependency that blocks the state of the object (completed or not)
Both kind of dependencies can be set at the samne time.

