/* JAT: Java Astrodynamics Toolkit
 * 
  Copyright 2012 Tobias Berthold

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

	/**
	 * Use this if called from application
	 */
function PathUtil() {
	if (this.debug)
		console.log("<PathUtil > constructor ");
	this.root_path = this.find_root();
	this.data_path = this.root_path + "data/";
	this.DE405Path = this.root_path + "data/core/ephemeris/DE405data/";

}



PathUtil.prototype.find_root = function() {

	return "http:./jat/";
};


